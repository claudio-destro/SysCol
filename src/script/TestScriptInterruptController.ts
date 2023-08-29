export interface TestScriptInterruptSignal {
  readonly interrupted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reason: any;
  throwIfInterrupted(): void;
}

export interface TestScriptInterruptController {
  readonly signal: TestScriptInterruptSignal;
  interrupt(): void;
}
