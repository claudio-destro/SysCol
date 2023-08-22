import {hrtime} from "node:process";
import {PathOrFileDescriptor, readFile} from "node:fs";
import {ReadlineParser, SerialPort} from "serialport";
import {openSerialPort} from "./openSerialPort";
import {parseCommand} from "./parseCommand";
import {parseResponse} from "./parseCommandResponse";
import {sleep} from "./sleep";
import {stringifyHardwareCommand} from "./stringifyHardwareCommand";
import {SysColTestScriptApi} from "../SysColApi";
import {getTestOutcome} from "./getTestOutcome";

const hrtimeToMicroseconds = ([n, m]: [number, number]): number => n * 1000000 + m / 1000;

/* eslint default-case: "off" */
/* eslint no-continue: "off" */

const padNumber = (num: number, pad = 5, fill = "0") => String(num).padStart(pad, fill);

export class TestScript implements SysColTestScriptApi {
  #data: Array<string>;
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort: SerialPort;
  #serialPortReader: ReadlineParser;

  constructor(data: string | Buffer) {
    this.#data = data.toString().split(/\r\n|\r|\n/gm);
  }

  static async fromFile(path: PathOrFileDescriptor): Promise<TestScript> {
    return new Promise<TestScript>((resolve, reject) => {
      readFile(path, (err, data) => (err ? reject(err) : resolve(new TestScript(data))));
    });
  }

  static async from(data: string | Buffer) {
    return new TestScript(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScriptError(err: any, lineno: number): void {
    console.error("Error at line", lineno, err);
  }

  onLogMessage(str: string): void {
    console.log("===============", str);
  }

  onLogCommand(cmd: string, lineno: number): void {
    console.log(padNumber(lineno), "       <<", cmd.trim());
  }

  onCommandError(cmd: string, lineno: number): void {
    console.error(padNumber(lineno), " ERROR >>", cmd.trim());
  }

  onCommandResponse(cmd: string, elapsed: number, lineno: number): void {
    console.log(padNumber(lineno), "       >>", cmd.trim(), `in ${elapsed}ms`);
  }

  onTestPassed(cmd: string, elapsed: number, lineno: number): void {
    console.info(padNumber(lineno), "  PASS >>", cmd.trim(), `in ${elapsed}ms`);
  }

  onTestFailed(cmd: string, elapsed: number, lineno: number): void {
    console.warn(padNumber(lineno), "  FAIL >>", cmd.trim(), `in ${elapsed}ms`);
  }

  async executeScript() {
    try {
      for await (const ret of this.#executeCommand()) {
        const {response, elapsed} = ret;
        const [cmd, params] = parseResponse(response);
        if ("ERR" in params) {
          this.onCommandError(response, this.#currentLine);
          continue;
        }
        if (cmd === "tst") {
          switch (getTestOutcome(params).result) {
            case "FAIL":
              this.onTestFailed(response, elapsed, this.#currentLine);
              continue;
            case "PASS":
              this.onTestPassed(response, elapsed, this.#currentLine);
              continue;
          }
          // fallthrough
        }
        this.onCommandResponse(response, elapsed, this.#currentLine);
      }
    } catch (err) {
      this.onScriptError(err, this.#currentLine);
    } finally {
      this.#currentLine = 0;
    }
  }

  #nextLine(): string | null {
    if (this.#currentLine < this.#data.length) {
      const row = this.#data[this.#currentLine++];
      const m = /^([^#]*)/.exec(row);
      return m && m[1].trim() ? m[1] : this.#nextLine();
    }
    return null;
  }

  async *#executeCommand() {
    for (;;) {
      const row = this.#nextLine();
      if (row === null) return;
      const [cmd, ...args] = parseCommand(row);
      if (cmd.match(/^@/)) {
        this.onLogMessage(row);
        switch (cmd.substring(1)) {
          case "close":
            this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "open":
            this.#serialPort?.close();
            this.#serialPort = await openSerialPort(args[0], args[1]);
            this.#serialPortReader = this.#serialPort.pipe(new ReadlineParser());
            break;
          case "timeout":
            {
              const timeout = +args[0];
              if (!isNaN(timeout)) this.#commandTimeout = timeout;
            }
            break;
          case "wait":
            await sleep(+args[0]);
            break;
          default:
            throw new SyntaxError(`Unrecognized command ${JSON.stringify(cmd)}`);
        }
      } else {
        yield this.#sendCommandAndWaitResponse(stringifyHardwareCommand(cmd, ...args));
      }
    }
  }

  async #sendCommandAndWaitResponse(cmd: string, timeout = this.#commandTimeout) {
    this.onLogCommand(cmd, this.#currentLine);
    return new Promise<{response: string; elapsed: number}>((resolve, reject) => {
      const startTime = hrtimeToMicroseconds(hrtime());

      const onData = (response: string | Buffer): void => {
        const endTime = hrtimeToMicroseconds(hrtime());
        // eslint-disable-next-line no-use-before-define
        clearTimeout(id);
        resolve({
          response: response.toString(),
          elapsed: endTime - startTime,
        });
      };

      const id = setTimeout(() => {
        this.#serialPortReader.off("data", onData);
        reject(new RangeError(`"${cmd}" timed out after ${this.#commandTimeout}ms`));
      }, timeout);

      this.#serialPortReader.once("data", onData);

      this.#serialPort.write(cmd, err => {
        this.#serialPortReader.off("data", onData);
        clearTimeout(id);
        reject(err);
      });
    });
  }
}
