import EventEmitter from "eventemitter3";
import {openSerialPort} from "./macros/openSerialPort";
import {sleep} from "./macros/sleep";
import {TestConfirmFunction, TestScript, TestScriptReadyState} from "./TestScript";
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
import {CommandProtocol, TestOutCome} from "./CommandProtocol";
import {TestScriptCounters} from "./TestScriptCounters";

const getCurrentTimeInMicroseconds = () => (performance.now() * 1_000) | 0;

type ExecutedCommandStats = {response: string; elapsed: number};

const NULL_RESPONSE: ExecutedCommandStats = {response: null, elapsed: -1} as const;

export class TestScriptImpl implements TestScript {
  signal?: TestScriptInterruptSignal | null;
  confirm: TestConfirmFunction = null;
  readonly #events = new EventEmitter<string>();
  readonly #filePath?: string | null;
  readonly #text: Array<string>;
  readonly #environment: Environment;
  readonly #protocol: CommandProtocol;
  #readyState: TestScriptReadyState = "new";
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort?: SerialPort | null;
  #logFile?: TextFileWriter | null;
  #testCounters: TestScriptCounters;

  constructor(path: string, text: string, environment: Environment, protocol: CommandProtocol, counters: TestScriptCounters = {pass: 0, fail: 0}) {
    this.#filePath = path;
    this.#text = text.split(/\r\n|\r|\n/gm);
    this.#environment = environment;
    this.#protocol = protocol;
    this.#testCounters = counters;
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
    return this.#executeScript()
      .catch(err => {
        this.#emit("error", err);
        throw err;
      })
      .finally(() => {
        this.#logFile?.close();
      })
      .finally(() => {
        this.#reset();
      });
  }

  #reset(): void {
    this.#logFile = null;
    this.#currentLine = 0;
    this.#testCounters = {pass: 0, fail: 0};
  }

  async #executeScript(): Promise<void> {
    this.#readyState = "running";
    this.#emit("start");
    try {
      for await (const {response, elapsed} of this.#executeSingleCommand()) {
        if (!response) continue;
        const {argv, error} = this.#protocol.parseCommandResponse(response);
        if (error) {
          this.#emit("message", "error", response);
          continue;
        }
        const {result} = this.#protocol.getTestResult(argv);
        switch (result) {
          case "FAIL":
          case "PASS":
            ++this.#testCounters[result.toLowerCase() as Lowercase<TestOutCome>];
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
      err?.addScript(this);
      throw err;
    } finally {
      this.#emit("stop");
      await this.#serialPort?.close();
      this.#serialPort = null;
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
    return m?.[1].trim() ? m[1] : this.#nextLine();
  }

  async *#executeSingleCommand(): AsyncGenerator<ExecutedCommandStats> {
    for (;;) {
      this.signal?.throwIfInterrupted();
      const row = this.#nextLine();
      if (row === null) return;
      const {command, commandLine, argv, macro} = this.#protocol.parseCommand(row);
      if (macro) {
        switch (command) {
          case "echo":
            this.#emit("message", "log", commandLine);
            break;
          case "close_log_file":
            this.#emit("message", "info", row);
            await this.#logFile?.close();
            this.#logFile = null;
            break;
          case "close_serial_port":
            this.#emit("message", "info", row);
            await this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "confirm_test":
            if (argv.length !== 7) throw new TestScriptError("Bad parameters", "SyntaxError");
            try {
              const [prompt, testId, , , , , passValue] = argv;
              const ret = await this.confirm?.(this.#commandTimeout, prompt, {label: argv[2], value: argv[3]}, {label: argv[4], value: argv[5]});
              const success = ret === passValue;
              ++this.#testCounters[success ? "pass" : "fail"];
              yield {
                ...NULL_RESPONSE,
                response: this.#protocol.stringifyTestCommandResponse(testId, success),
              };
            } catch (e) {
              throw new TestScriptError(e.message, "InvocationError", e);
            }
            break;
          case "if":
            yield this.#onCondition(argv[0], argv.slice(1));
            break;
          case "open_log_file":
            this.#emit("message", "info", row);
            await this.#logFile?.close();
            this.#logFile = await openLogFile({
              logFile: argv[0],
              format: argv[1] as LogOutputType,
              environment: this.#environment,
              protocol: this.#protocol,
              parentScript: this,
            });
            this.#emit("message", "info", this.#logFile.filePath);
            break;
          case "open_serial_port":
            this.#emit("message", "info", row);
            await this.#serialPort?.close();
            this.#serialPort = await openSerialPort({
              path: argv[0],
              args: argv[1],
              environment: this.#environment,
              protocol: this.#protocol,
              parentScript: this,
            });
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
        yield this.#sendCommandAndWaitResponse(this.#protocol.stringifyHardwareCommand(command, ...argv));
      }
    }
  }

  async #runScript(scriptFile: string): Promise<void> {
    const script: TestScript = await loadScript({
      scriptFile,
      counters: this.#testCounters,
      environment: this.#environment,
      protocol: this.#protocol,
      parentScript: this,
    });
    this.#emit("message", "info", script.filePath.toString());
    this.#listeners("message").forEach(listener => script.on("message", listener));
    this.#listeners("command").forEach(listener => script.on("command", listener));
    this.#listeners("response").forEach(listener => script.on("response", listener));
    this.#listeners("test").forEach(listener => script.on("test", listener));
    return script.execute();
  }

  async #sendCommandAndWaitResponse(cmd: string, timeout = this.#commandTimeout): Promise<ExecutedCommandStats> {
    this.#emit("command", cmd);
    if (!this.#serialPort) throw new TestScriptError("Serial port not open", "SyntaxError");
    const startTime = getCurrentTimeInMicroseconds();
    await this.#serialPort.write(cmd);
    let response: string | null;
    try {
      response = await this.#serialPort.read(timeout);
    } catch (e) {
      throw new TestScriptError(e.message, "HardwareError", e);
    }
    const endTime = getCurrentTimeInMicroseconds();
    if (response === null) throw new TestScriptError(`"${cmd}" timed out after ${timeout}ms`, "TimeoutError");
    return {response, elapsed: endTime - startTime};
  }

  #onCondition(condition: string, argv: string[]): Promise<ExecutedCommandStats> {
    switch (condition) {
      case "fail":
        return this.#onFail(argv);
      case "pass":
        return this.#onPass(argv);
    }
    throw new TestScriptError(`Unknown condition ${JSON.stringify(condition)}`, "SyntaxError");
  }

  async #onFail(args: string[]): Promise<ExecutedCommandStats> {
    if (this.#testCounters.fail > 0) {
      return this.#sendCommandAndWaitResponse(this.#protocol.stringifyHardwareCommand(args[0], ...args.slice(1)));
    }
    return NULL_RESPONSE;
  }

  async #onPass(args: string[]): Promise<ExecutedCommandStats> {
    if (this.#testCounters.pass > 0 && this.#testCounters.fail === 0) {
      return this.#sendCommandAndWaitResponse(this.#protocol.stringifyHardwareCommand(args[0], ...args.slice(1)));
    }
    return NULL_RESPONSE;
  }
}
