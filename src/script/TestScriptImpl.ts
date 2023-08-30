import EventEmitter from "node:events";
import {cwd, hrtime} from "node:process";
import {dirname, resolve} from "node:path";
import {PathLike} from "node:fs";
import {RegexParser, SerialPort} from "serialport";
import {openSerialPort} from "./macros/openSerialPort";
import {parseCommand} from "./protocol/parseCommand";
import {parseCommandResponse} from "./protocol/parseCommandResponse";
import {sleep} from "./macros/sleep";
import {stringifyHardwareCommand} from "./protocol/stringifyHardwareCommand";
import {getTestResult} from "./protocol/getTestResult";
import {TestScript, TestScriptReadyState} from "./TestScript";
import {TestScriptEvent, TestScriptListenerMap, TestScriptListeners} from "./TestScriptEvents";
import {TestScriptInterruptSignal} from "./TestScriptInterruptController";
import {TestScriptFactory} from "./TestScriptFactory";
import {parseInterval} from "./macros/parseInterval";
import {openLogFile} from "./macros/openLogFile";
import {LogFile} from "./LogFile";
import {TestScriptError} from "./TestScriptError";

const hrtimeToMicroseconds = ([n, m]: [number, number]): number => n * 1000000 + m / 1000;

const resolvePathAgainstScript = (script: TestScript, file: string): string => {
  const {filePath: basePath} = script;
  const basedir = typeof basePath === "string" || basePath instanceof Buffer ? dirname(basePath.toString()) : cwd();
  return resolve(basedir, file);
};

export class TestScriptImpl implements TestScript {
  signal?: TestScriptInterruptSignal | null;
  readonly #events = new EventEmitter();
  readonly #path?: PathLike | null;
  readonly #data: Array<string>;
  #readyState: TestScriptReadyState = "new";
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort?: SerialPort | null;
  #serialPortReader?: RegexParser | null;
  #logFileWriter?: LogFile | null;

  constructor(path: PathLike | null, data: string | Buffer) {
    this.#path = path;
    this.#data = data.toString().split(/\r\n|\r|\n/gm);
  }

  get filePath(): PathLike | null {
    return this.#path;
  }

  get lineNumber(): number {
    return this.#currentLine;
  }

  get readyState(): TestScriptReadyState {
    return this.#readyState;
  }

  on<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void {
    this.#events.on(event, listener);
  }

  once<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void {
    this.#events.once(event, listener);
  }

  off<T extends TestScriptEvent>(event: T, listener?: TestScriptListenerMap[T]): void {
    this.#events.off(event, listener);
  }

  async execute(): Promise<void> {
    this.#readyState = "running";
    this.#emit("start");
    try {
      for await (const {response, elapsed} of this.#executeSingleCommand()) {
        const {argv, error} = parseCommandResponse(response);
        if (error) {
          this.#emit("message", "error", response);
          continue;
        }
        const {result} = getTestResult(argv);
        switch (result) {
          case "FAIL":
          case "PASS":
            this.#emit("test", response, result === "PASS", elapsed);
            break;
          default:
            this.#emit("response", response, elapsed);
            break;
        }
      }
      this.#readyState = "stopped";
    } catch (e) {
      this.#readyState = "stopped";
      const err = e as TestScriptError;
      if (!err?.addScript(this)) this.#emit("error", err);
      throw err;
    } finally {
      this.#emit("stop");
      this.#serialPort?.close();
      this.#serialPortReader?.destroy();
      this.#logFileWriter?.close();
      this.#serialPort = null;
      this.#serialPortReader = null;
      this.#logFileWriter = null;
      this.#currentLine = 0;
    }
  }

  #emit<T extends TestScriptEvent>(event: T, ...args: Parameters<TestScriptListeners[T]>): void {
    this.#events.emit(event, ...args);
  }

  #listeners<T extends TestScriptEvent>(event: T): Array<TestScriptListeners[T]> {
    return this.#events.listeners(event) as Array<TestScriptListeners[T]>;
  }

  #nextLine(): string | null {
    if (this.#currentLine >= this.#data.length) return null;
    const row = this.#data[this.#currentLine++];
    const m = /^([^#]*)/.exec(row);
    return m && m[1].trim() ? m[1] : this.#nextLine();
  }

  async *#executeSingleCommand() {
    for (;;) {
      this.signal?.throwIfInterrupted();
      const row = this.#nextLine();
      if (row === null) return;
      const {command, commandLine, argv} = parseCommand(row);
      if (command.match(/^@/)) {
        switch (command.substring(1)) {
          case "echo":
            this.#emit("message", "log", commandLine);
            break;
          case "close_log_file":
            this.#emit("message", "info", row);
            this.#logFileWriter?.close();
            this.#logFileWriter = null;
            break;
          case "close_serial_port":
            this.#emit("message", "info", row);
            this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "open_log_file":
            this.#emit("message", "info", row);
            this.#logFileWriter = await openLogFile(this, argv[0]);
            this.#emit("message", "info", this.#logFileWriter.path);
            break;
          case "open_serial_port":
            this.#emit("message", "info", row);
            this.#serialPort?.close();
            this.#serialPort = await openSerialPort(argv[0], argv[1]);
            this.#serialPortReader = this.#serialPort.pipe(new RegexParser({regex: /[\r\n]+/}));
            break;
          case "run_script":
            this.#emit("message", "info", row);
            await this.#runScript(argv[0]);
            break;
          case "timeout":
            this.#commandTimeout = parseInterval(argv[0]);
            this.#emit("message", "info", row);
            break;
          case "wait": {
            const interval = parseInterval(argv[0]);
            this.#emit("message", "info", row);
            await sleep(interval);
            break;
          }
          default:
            throw new TestScriptError(`Unrecognized command ${JSON.stringify(command)}`, "SYNTAX_ERROR");
        }
      } else {
        yield this.#sendCommandAndWaitResponse(stringifyHardwareCommand(command, ...argv));
      }
    }
  }

  async #runScript(scriptFile: string): Promise<void> {
    const script = await TestScriptFactory.fromFile(resolvePathAgainstScript(this, scriptFile));
    script.signal = this.signal;
    this.#emit("message", "info", script.filePath.toString());
    this.#listeners("message").forEach(listener => script.on("message", listener));
    this.#listeners("command").forEach(listener => script.on("command", listener));
    this.#listeners("response").forEach(listener => script.on("response", listener));
    this.#listeners("test").forEach(listener => script.on("test", listener));
    return script.execute();
  }

  async #sendCommandAndWaitResponse(cmd: string, timeout = this.#commandTimeout) {
    this.#emit("command", cmd);
    return new Promise<{response: string; elapsed: number}>((resolve, reject) => {
      const startTime = hrtimeToMicroseconds(hrtime());

      const onData = (response: string | Buffer): void => {
        const endTime = hrtimeToMicroseconds(hrtime());
        // eslint-disable-next-line no-use-before-define
        this.#serialPortReader?.off("error", onError);
        // eslint-disable-next-line no-use-before-define
        clearTimeout(id);
        resolve({
          response: response.toString(),
          elapsed: endTime - startTime,
        });
      };

      const onError = (error: Error): void => {
        // eslint-disable-next-line no-use-before-define
        this.#serialPortReader?.off("data", onData);
        // eslint-disable-next-line no-use-before-define
        clearTimeout(id);
        reject(error);
      };

      const id = setTimeout(() => {
        this.#serialPortReader?.off("data", onData);
        this.#serialPortReader?.off("error", onError);
        reject(new TestScriptError(`"${cmd}" timed out after ${timeout}ms`, "TIMEOUT_ERROR"));
      }, timeout);

      this.#serialPortReader?.once("data", onData);
      this.#serialPortReader?.once("error", onError);

      this.#serialPort?.write(cmd);
      this.#serialPort?.drain();
    });
  }
}
