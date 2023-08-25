import {PathLike} from "node:fs";
import {FileHandle, readFile} from "node:fs/promises";
import {TestScript} from "./TestScript";
import {TestScriptImpl} from "./TestScriptImpl";

export class TestScriptFactory {
  static async fromFile(path: PathLike | FileHandle): Promise<TestScript> {
    return new TestScriptImpl(await readFile(path));
  }

  static async fromBuffer(data: string | Buffer): Promise<TestScript> {
    return new TestScriptImpl(data);
  }
}
