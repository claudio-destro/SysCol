import {TestScriptInterruptController, TestScriptInterruptSignal} from "./TestScriptInterruptController";
import {TestScriptError} from "./TestScriptError";

type Interrupt = {interrupted: boolean};

class TestScriptInterruptSignalImpl implements TestScriptInterruptSignal {
  readonly #interrupt: Interrupt;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #reason?: any;

  constructor(interrupt: Interrupt) {
    this.#interrupt = interrupt;
  }

  get interrupted(): boolean {
    return this.#interrupt.interrupted;
  }

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get reason(): any | undefined { // NOSONAR
    return this.#interrupt.interrupted ? this.#reason ?? new TestScriptError("Interrupted", "InterruptError") : undefined;
  }

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set reason(reason: any | undefined) { // NOSONAR
    this.#reason = reason;
  }

  throwIfInterrupted(): void {
    if (this.#interrupt.interrupted) throw this.reason;
  }
}

export class TestScriptInterruptControllerImpl implements TestScriptInterruptController {
  readonly #interrupt: Interrupt = {interrupted: false};
  readonly #signal = new TestScriptInterruptSignalImpl(this.#interrupt);

  get signal(): TestScriptInterruptSignal {
    return this.#signal;
  }

  interrupt() {
    this.#interrupt.interrupted = true;
  }
}
