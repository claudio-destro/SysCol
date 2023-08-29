export interface TestScriptListeners {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(error: any): void;
  command(command: string): void;
  response(response: string, elapsed: number): void;
  test(response: string, passed: boolean, elapsed: number): void;
  message(type: "log" | "info" | "error", message: string): void;
  start(): void;
  stop(): void;
}

export type TestScriptEvent = keyof TestScriptListeners;

export type TestScriptListenerMap = {
  [event in TestScriptEvent]: TestScriptListeners[event];
};
