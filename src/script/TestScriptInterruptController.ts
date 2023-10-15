export interface TestScriptInterruptSignalListeners {
  interrupt: () => void;
}

export type TestScriptInterruptSignalEvents = keyof TestScriptInterruptSignalListeners;

export type TestScriptInterruptSignalListenerMap = {
  [event in TestScriptInterruptSignalEvents]: TestScriptInterruptSignalListeners[event];
};

export interface TestScriptInterruptSignal {
  readonly interrupted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reason: any;
  throwIfInterrupted(): void;
  on<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void;
  once<T extends TestScriptInterruptSignalEvents>(event: T, listener: TestScriptInterruptSignalListenerMap[T]): void;
  off<T extends TestScriptInterruptSignalEvents>(event: T, listener?: TestScriptInterruptSignalListenerMap[T]): void;
}

export interface TestScriptInterruptController {
  readonly signal: TestScriptInterruptSignal;
  interrupt(): void;
}
