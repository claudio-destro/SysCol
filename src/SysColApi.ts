export interface SysColTestScriptApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScriptError(error: any, lineno: number): void;
  onLogMessage(message: string): void;
  onLogCommand(command: string, lineno: number): void;
  onCommandError(command: string, lineno: number): void;
  onCommandResponse(command: string, elapsed: number, lineno: number): void;
  onTestPassed(command: string, elapsed: number, lineno: number): void;
  onTestFailed(command: string, elapsed: number, lineno: number): void;
}

export type SysColApi = SysColTestScriptApi & {
  onSetScriptFileName(name: string): void;
  executeScript(): void;
};

declare global {
  export interface Window {
    SysCol: SysColApi;
  }
}
