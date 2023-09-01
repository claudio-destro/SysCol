import {TestScript} from "./TestScript";

export interface TestScriptBuilder {
  fromFile(path: string): Promise<TestScript>;
  fromBuffer(data: string): Promise<TestScript>;
  resolve(path: string, basePath?: string | null): Promise<string>;
}
