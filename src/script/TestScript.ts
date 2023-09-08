import {TestScriptEvent, TestScriptListenerMap} from "./TestScriptEvents";
import {TestScriptInterruptSignal} from "./TestScriptInterruptController";

export type TestScriptReadyState = "new" | "running" | "stopped";

export interface TestScript {
  readonly filePath: string | null;
  readonly lineNumber: number;
  readonly readyState: TestScriptReadyState;
  signal?: TestScriptInterruptSignal | null;
  execute(): Promise<void>;
  on<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void;
  once<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void;
  off<T extends TestScriptEvent>(event: T, listener?: TestScriptListenerMap[T]): void;
}
