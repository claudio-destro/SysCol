import {TestScriptEvent, TestScriptListenerMap} from "./TestScriptEvents";
import {PathLike} from "node:fs";

export interface TestScript {
  readonly filePath: PathLike | null;
  readonly lineNumber: number;
  executeScript(): Promise<void>;
  on<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void;
  once<T extends TestScriptEvent>(event: T, listener: TestScriptListenerMap[T]): void;
  off<T extends TestScriptEvent>(event: T, listener?: TestScriptListenerMap[T]): void;
}
