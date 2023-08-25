import {hrtime} from "node:process";
import {FileHandle, readFile} from "node:fs/promises";
import {PathLike} from "node:fs";
import {ReadlineParser, SerialPort} from "serialport";
import {openSerialPort} from "./macros/openSerialPort";
import {parseCommand} from "./protocol/parseCommand";
import {parseCommandResponse, wasCommandMalformed} from "./protocol/parseCommandResponse";
import {sleep} from "./macros/sleep";
import {stringifyHardwareCommand} from "./protocol/stringifyHardwareCommand";
import {getTestResult} from "./protocol/getTestResult";
import {TestScript} from "./TestScript";
import EventEmitter from "node:events";
import {TestScriptEvent, TestScriptListenerMap, TestScriptListeners} from "./TestScriptEvents";
import {parseInterval} from "./macros/parseInterval";

const hrtimeToMicroseconds = ([n, m]: [number, number]): number => n * 1000000 + m / 1000;

export class TestScriptImpl implements TestScript {
  #events = new EventEmitter();
  #data: Array<string>;
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort?: SerialPort | null;
  #serialPortReader?: ReadlineParser | null;

  constructor(data: string | Buffer) {
    this.#data = data.toString().split(/\r\n|\r|\n/gm);
  }

  get lineNumber(): number {
    return this.#currentLine;
  }

  static async fromFile(path: PathLike | FileHandle): Promise<TestScript> {
    return new TestScriptImpl(await readFile(path));
  }

  static async fromBuffer(data: string | Buffer): Promise<TestScript> {
    return new TestScriptImpl(data);
  }

  on<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void {
    this.#events.on(event, listener);
  }

  once<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void {
    this.#events.on(event, listener);
  }

  off<T extends TestScriptEvent>(event: T, listener?: TestScriptListenerMap[T]): void {
    this.#events.on(event, listener);
  }

  async executeScript() {
    this.#emit("message", new Date().toISOString());
    try {
      for await (const {response, elapsed} of this.#executeSingleCommand()) {
        const {argv} = parseCommandResponse(response);
        if (wasCommandMalformed(argv)) {
          this.#emit("commandError", response);
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
    } catch (err) {
      console.error("Error", err);
      this.#emit("error", err);
    } finally {
      this.#serialPort?.close();
      this.#serialPortReader?.destroy();
      this.#serialPortReader = null;
      this.#serialPort = null;
      this.#currentLine = 0;
    }
  }

  #emit<T extends TestScriptEvent>(event: T, ...args: Parameters<TestScriptListeners[T]>): void {
    this.#events.emit(event, ...args);
  }

  #nextLine(): string | null {
    if (this.#currentLine >= this.#data.length) return null;
    const row = this.#data[this.#currentLine++];
    const m = /^([^#]*)/.exec(row);
    return m && m[1].trim() ? m[1] : this.#nextLine();
  }

  async *#executeSingleCommand() {
    for (;;) {
      const row = this.#nextLine();
      if (row === null) return;
      const {command, commandLine, argv} = parseCommand(row);
      if (command.match(/^@/)) {
        switch (command.substring(1)) {
          case "echo":
            this.#emit("message", commandLine);
            break;
          case "close":
            this.#emit("message", row);
            this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "open":
            this.#emit("message", row);
            this.#serialPort?.close();
            this.#serialPort = await openSerialPort(argv[0], argv[1]);
            this.#serialPortReader = this.#serialPort.pipe(
              new ReadlineParser({
                includeDelimiter: true,
                delimiter: "}",
              }),
            );
            break;
          case "timeout":
            this.#commandTimeout = parseInterval(argv[0]);
            this.#emit("message", row);
            break;
          case "wait":
            await sleep(parseInterval(argv[0]));
            this.#emit("message", row);
            break;
          default:
            throw new SyntaxError(`Unrecognized command ${JSON.stringify(command)}`);
        }
      } else {
        yield this.#sendCommandAndWaitResponse(stringifyHardwareCommand(command, ...argv));
      }
    }
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
        reject(new RangeError(`"${cmd}" timed out after ${timeout}ms`));
      }, timeout);

      this.#serialPortReader?.once("data", onData);
      this.#serialPortReader?.once("error", onError);

      this.#serialPort?.write(cmd);
      this.#serialPort?.drain();
    });
  }
}
