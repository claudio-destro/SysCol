import {readFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {TestScript} from "./script/TestScript";
import {TestScriptImpl} from "./script/TestScriptImpl";
import {TestScriptBuilder} from "./script/TestScriptBuilder";

export class TestScriptBuilderImpl implements TestScriptBuilder {
  async fromFile(path: string): Promise<TestScript> {
    const data: Buffer = await readFile(path);
    return new TestScriptImpl(path, data.toString(), this);
  }

  async fromBuffer(data: string): Promise<TestScript> {
    return new TestScriptImpl(null, data, this);
  }

  async resolve(path: string, basePath?: string | null): Promise<string> {
    return resolve(dirname(basePath ?? ""), path);
  }
}
