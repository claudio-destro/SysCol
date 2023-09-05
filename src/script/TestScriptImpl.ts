import EventEmitter from "eventemitter3";
import {openSerialPort} from "./macros/openSerialPort";
import {parseCommand} from "./protocol/parseCommand";
import {parseCommandResponse} from "./protocol/parseCommandResponse";
import {sleep} from "./macros/sleep";
import {stringifyHardwareCommand} from "./protocol/stringifyHardwareCommand";
import {getTestResult} from "./protocol/getTestResult";
import {TestScript, TestScriptReadyState} from "./TestScript";
import {TestScriptEvent, TestScriptListenerMap, TestScriptListeners} from "./TestScriptEvents";
import {TestScriptInterruptSignal} from "./TestScriptInterruptController";
import {parseInterval} from "./macros/parseInterval";
import {openLogFile} from "./macros/openLogFile";
import {TestScriptError} from "./TestScriptError";
import {TextFileWriter} from "../environment/TextFileWriter";
import {Environment} from "../environment/Environment";
import {SerialPort} from "../environment/SerialPort";
import {loadScript} from "./macros/loadScript";
import {LogOutputType} from "./LogOutputType";

const microseconds = () => (performance.now() * 1_000) | 0;

export class TestScriptImpl implements TestScript {
  signal?: TestScriptInterruptSignal | null;
  readonly #events = new EventEmitter<string>();
  readonly #filePath?: string | null;
  readonly #text: Array<string>;
  readonly #environment: Environment;
  #readyState: TestScriptReadyState = "new";
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort?: SerialPort | null;
  #logFileWriter?: TextFileWriter | null;

  constructor(path: string, text: string, env: Environment) {
    this.#filePath = path;
    this.#text = text.split(/\r\n|\r|\n/gm);
    this.#environment = env;
  }

  get filePath(): string | null {
    return this.#filePath;
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
      await this.#serialPort?.close();
      await this.#logFileWriter?.close();
      this.#serialPort = null;
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
    if (this.#currentLine >= this.#text.length) return null;
    const row = this.#text[this.#currentLine++];
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
            await this.#logFileWriter?.close();
            this.#logFileWriter = null;
            break;
          case "close_serial_port":
            this.#emit("message", "info", row);
            await this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "open_log_file":
            this.#emit("message", "info", row);
            this.#logFileWriter = await openLogFile(this, argv[0], argv[1] as LogOutputType, this.#environment);
            this.#emit("message", "info", this.#logFileWriter.filePath);
            break;
          case "open_serial_port":
            this.#emit("message", "info", row);
            await this.#serialPort?.close();
            this.#serialPort = await openSerialPort(argv[0], argv[1], this.#environment);
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
            throw new TestScriptError(`Unrecognized command ${JSON.stringify(command)}`, "SyntaxError");
        }
      } else {
        yield this.#sendCommandAndWaitResponse(stringifyHardwareCommand(command, ...argv));
      }
    }
  }

  async #runScript(scriptFile: string): Promise<void> {
    const script: TestScript = await loadScript(this, scriptFile, this.#environment);
    this.#emit("message", "info", script.filePath.toString());
    this.#listeners("message").forEach(listener => script.on("message", listener));
    this.#listeners("command").forEach(listener => script.on("command", listener));
    this.#listeners("response").forEach(listener => script.on("response", listener));
    this.#listeners("test").forEach(listener => script.on("test", listener));
    return script.execute();
  }

  async #sendCommandAndWaitResponse(cmd: string, timeout = this.#commandTimeout) {
    this.#emit("command", cmd);
    const startTime = microseconds();
    await this.#serialPort?.write(cmd);
    let response: string | null;
    try {
      response = await this.#serialPort.read(timeout);
    } catch (e) {
      throw new TestScriptError(e.message, "HardwareError");
    }
    const endTime = microseconds();
    if (response === null) throw new TestScriptError(`"${cmd}" timed out after ${timeout}ms`, "TimeoutError");
    return {response, elapsed: endTime - startTime};
  }
}
