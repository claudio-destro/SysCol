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
import {Command} from "./Command";

const getCurrentTimeInMicroseconds = () => (performance.now() * 1_000) | 0;

type ExecutedCommandStats = {response: string; elapsed: number};

const NULL_RESPONSE: ExecutedCommandStats = {response: null, elapsed: -1} as const;

const validateArgsEq =
  (wanted: number): ((args: string[]) => void) =>
  ({length: numberOfArgs}: string[]): void => {
    if (numberOfArgs !== wanted) {
      throw new TestScriptError(`Bad parameters (${wanted})`, "SyntaxError");
    }
  };

const validateMinimumArgs =
  (minimum: number): ((args: string[]) => void) =>
  ({length: numberOfArgs}: string[]): void => {
    if (numberOfArgs < minimum) {
      throw new TestScriptError(`Bad parameters (>=${minimum})`, "SyntaxError");
    }
  };

export class TestScriptImpl implements TestScript {
  signal?: TestScriptInterruptSignal | null;
  confirm: TestConfirmFunction = null;
  readonly #events = new EventEmitter<string>();
  readonly #filePath?: string | null;
  readonly #text: Array<string>;
  readonly #environment: Environment;
  readonly #protocol: CommandProtocol;
  #globalConditions: Record<string, string[]> = {};
  #readyState: TestScriptReadyState = "new";
  #currentLine = 0;
  #commandTimeout = 5000;
  #serialPort?: SerialPort | null;
  #logFile?: TextFileWriter | null;
  #testCounters: TestScriptCounters;
  #cancelCurrentCommand?: () => void;

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
    const onInterrupt = () => this.#cancelCurrentCommand?.();
    this.signal?.once("interrupt", onInterrupt);
    return this.#executeScript()
      .catch(err => {
        this.#emit("error", err);
        throw err;
      })
      .finally(() => {
        this.#logFile?.close();
      })
      .finally(() => {
        this.signal?.off("interrupt", onInterrupt);
        this.#reset();
      });
  }

  #reset(): void {
    this.#logFile = null;
    this.#currentLine = 0;
    this.#testCounters = {pass: 0, fail: 0};
    this.#globalConditions = {};
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
      await this.#executeOnCondition("end");
    } catch (e) {
      this.#readyState = "stopped";
      await this.#executeOnCondition("error");
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

  readonly #MACROS: Readonly<
    Record<
      string,
      {
        validateArgs: (args: string[]) => void;
        executeMacro: (command: Command) => Promise<ExecutedCommandStats | void>;
      }
    >
  > = {
    close_log_file: {
      validateArgs: validateArgsEq(0),
      executeMacro: async (): Promise<void> => {
        await this.#logFile?.close();
        this.#logFile = null;
      },
    },
    close_serial_port: {
      validateArgs: validateArgsEq(0),
      executeMacro: async (): Promise<void> => {
        await this.#serialPort?.close();
        this.#serialPort = null;
      },
    },
    confirm_test: {
      validateArgs: validateArgsEq(7),
      executeMacro: async ({argv: [prompt, testId, label0, value0, label1, value1, passValue]}): Promise<ExecutedCommandStats> => {
        try {
          const ret = await this.confirm?.(this.#commandTimeout, prompt, {label: label0, value: value0}, {label: label1, value: value1});
          const success = ret === passValue;
          ++this.#testCounters[success ? "pass" : "fail"];
          return {
            ...NULL_RESPONSE,
            response: this.#protocol.stringifyTestCommandResponse(testId, success),
          };
        } catch (e) {
          if (!this.signal.interrupted) {
            throw new TestScriptError(e.message, "InvocationError", e);
          }
          // ignore
        }
      },
    },
    continue: {
      validateArgs: validateArgsEq(2),
      executeMacro: async ({argv: [prompt, label]}): Promise<void> => {
        try {
          await this.confirm?.(this.#commandTimeout, prompt, {label, value: "OK"});
        } catch (e) {
          if (!this.signal.interrupted) {
            throw new TestScriptError(e.message, "InvocationError", e);
          }
        }
      },
    },
    if: {
      validateArgs: validateMinimumArgs(2),
      executeMacro: async ({argv}): Promise<void> => {
        await this.#ifCondition(argv[0], argv.slice(1));
      },
    },
    on: {
      validateArgs: validateMinimumArgs(2),
      executeMacro: async ({argv}): Promise<void> => {
        await this.#onCondition(argv[0], argv.slice(1));
      },
    },
    open_log_file: {
      validateArgs: validateArgsEq(2),
      executeMacro: async ({argv: [logFile, format]}): Promise<void> => {
        await this.#logFile?.close();
        this.#logFile = await openLogFile({
          logFile,
          format: format as LogOutputType,
          environment: this.#environment,
          protocol: this.#protocol,
          parentScript: this,
        });
      },
    },
    open_serial_port: {
      validateArgs: validateArgsEq(2),
      executeMacro: async ({argv}): Promise<void> => {
        await this.#serialPort?.close();
        this.#serialPort = await openSerialPort({
          path: argv[0],
          args: argv[1],
          environment: this.#environment,
          protocol: this.#protocol,
          parentScript: this,
        });
      },
    },
    run_script: {
      validateArgs: validateArgsEq(1),
      executeMacro: async ({argv: [path]}): Promise<void> => {
        await this.#runScript(path);
      },
    },
    timeout: {
      validateArgs: validateArgsEq(1),
      executeMacro: async ({argv: [timeout]}): Promise<void> => {
        this.#commandTimeout = parseInterval(timeout);
      },
    },
    wait: {
      validateArgs: validateArgsEq(1),
      executeMacro: async ({argv: [timeout]}): Promise<void> => {
        const interval = parseInterval(timeout);
        const sleepResult = sleep(interval);
        this.#cancelCurrentCommand = sleepResult.cancel;
        try {
          await sleepResult.promise;
        } finally {
          this.#cancelCurrentCommand = null;
        }
      },
    },
  } as const;

  *#nextLine(): Generator<string | null> {
    while (this.#currentLine < this.#text.length) {
      const row = this.#text[this.#currentLine++];
      const m = /^([^#]*)/.exec(row);
      const str = m?.[1]?.trim();
      if (str) yield str;
    }
  }

  async *#executeSingleCommand(): AsyncGenerator<ExecutedCommandStats> {
    for (const row of this.#nextLine()) {
      this.signal?.throwIfInterrupted();
      const {command, commandLine, argv, macro} = this.#protocol.parseCommand(row);
      if (!macro) {
        yield this.#sendCommandAndWaitResponse(this.#protocol.stringifyHardwareCommand(command, ...argv));
      } else if (command === "echo") {
        this.#emit("message", "log", commandLine);
      } else {
        this.#emit("message", "info", row);
        const executor = this.#MACROS[command];
        if (executor) {
          const {validateArgs, executeMacro} = executor;
          validateArgs(argv);
          const ret = await executeMacro({commandLine, argv} as Command);
          if (ret) yield ret;
          // continue
        } else {
          throw new TestScriptError(`Unrecognized command ${JSON.stringify(command)}`, "SyntaxError");
        }
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
      const result = this.#serialPort.read(timeout);
      this.#cancelCurrentCommand = result.cancel;
      response = await result.promise;
    } catch (e) {
      throw new TestScriptError(e.message, "HardwareError", e);
    } finally {
      this.#cancelCurrentCommand = null;
    }
    const endTime = getCurrentTimeInMicroseconds();
    if (response === null) {
      if (!this.signal.interrupted) {
        throw new TestScriptError(`"${cmd}" timed out after ${timeout}ms`, "TimeoutError");
      }
    }
    return {response, elapsed: endTime - startTime};
  }

  async #sendOneCommandAndWaitResponse(args: string[]): Promise<ExecutedCommandStats> {
    return this.#sendCommandAndWaitResponse(this.#protocol.stringifyHardwareCommand(args[0], ...args.slice(1)));
  }

  #ifCondition(condition: string, argv: string[]): Promise<ExecutedCommandStats> {
    switch (condition) {
      case "fail":
        return this.#executeIfFail(argv);
      case "pass":
        return this.#executeIfPass(argv);
    }
    throw new TestScriptError(`Unknown condition ${JSON.stringify(condition)}`, "SyntaxError");
  }

  async #executeIfFail(args: string[]): Promise<ExecutedCommandStats> {
    return this.#testCounters.fail > 0 ? this.#sendOneCommandAndWaitResponse(args) : NULL_RESPONSE;
  }

  async #executeIfPass(args: string[]): Promise<ExecutedCommandStats> {
    return this.#testCounters.pass > 0 && this.#testCounters.fail === 0 ? this.#sendOneCommandAndWaitResponse(args) : NULL_RESPONSE;
  }

  async #onCondition(condition: string, argv: string[]): Promise<ExecutedCommandStats> {
    if (condition === "error") {
      this.#globalConditions[condition] = argv;
      return NULL_RESPONSE;
    }
    throw new TestScriptError(`Unknown global condition ${JSON.stringify(condition)}`, "SyntaxError");
  }

  async #executeOnCondition(condition: string): Promise<void> {
    const args: string[] | undefined | null = this.#globalConditions[condition];
    if (args?.length > 0) {
      try {
        const {response, elapsed} = await this.#sendOneCommandAndWaitResponse(args);
        this.#emit("response", response, elapsed);
      } catch (e) {
        this.#emit("error", e);
      }
    }
  }
}
