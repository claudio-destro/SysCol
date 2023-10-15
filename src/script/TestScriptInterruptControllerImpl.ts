import EventEmitter from "eventemitter3";
import {TestScriptInterruptController, TestScriptInterruptSignal, TestScriptInterruptSignalEvents, TestScriptInterruptSignalListenerMap} from "./TestScriptInterruptController";
import {TestScriptError} from "./TestScriptError";

class Interrupter {
  readonly #events = new EventEmitter<string>();
  #interrupted: boolean;

  get interrupted(): boolean {
    return this.#interrupted;
  }

  emit<T extends TestScriptInterruptSignalEvents>(event: T, ...args: Parameters<TestScriptInterruptSignalListenerMap[T]>): void {
    this.#events.emit(event, ...args);
  }

  on<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void {
    this.#events.on(event, listener);
  }

  once<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void {
    this.#events.once(event, listener);
  }

  off<T extends TestScriptInterruptSignalEvents>(event: T, listener?: TestScriptInterruptSignalListenerMap[T]): void {
    this.#events.off(event, listener);
  }

  interrupt(): void {
    if (!this.#interrupted) {
      this.#interrupted = true;
      this.emit("interrupt");
    }
  }
}

class TestScriptInterruptSignalImpl implements TestScriptInterruptSignal {
  readonly #interrupter: Interrupter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #reason?: any;

  constructor(interrupter: Interrupter) {
    this.#interrupter = interrupter;
  }

  get interrupted(): boolean {
    return this.#interrupter.interrupted;
  }

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get reason(): any | undefined { // NOSONAR
    return this.#interrupter.interrupted ? this.#reason ?? new TestScriptError("Interrupted", "InterruptError") : undefined;
  }

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set reason(reason: any | undefined) { // NOSONAR
    this.#reason = reason;
  }

  on<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void {
    this.#interrupter.on(event, listener);
  }

  once<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void {
    this.#interrupter.once(event, listener);
  }

  off<T extends TestScriptInterruptSignalEvents>(event: T, listener?: TestScriptInterruptSignalListenerMap[T]): void {
    this.#interrupter.off(event, listener);
  }

  throwIfInterrupted(): void {
    if (this.interrupted) throw this.reason;
  }
}

export class TestScriptInterruptControllerImpl implements TestScriptInterruptController {
  readonly #interrupter = new Interrupter();
  readonly #signal = new TestScriptInterruptSignalImpl(this.#interrupter);

  get signal(): TestScriptInterruptSignal {
    return this.#signal;
  }

  interrupt() {
    this.#interrupter.interrupt();
  }
}
