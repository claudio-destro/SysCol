import {PathLike} from "node:fs";
import {FileHandle, readFile} from "node:fs/promises";
import {TestScript} from "./TestScript";
import {TestScriptImpl} from "./TestScriptImpl";

export class TestScriptFactory {
  static async fromFile(path: PathLike | FileHandle): Promise<TestScript> {
    if (typeof path === "string" || path instanceof Buffer || path instanceof URL) {
      return new TestScriptImpl(path, await readFile(path));
    }
    // FileHandle
    return new TestScriptImpl(null, await readFile(path));
  }

  static async fromBuffer(data: string | Buffer): Promise<TestScript> {
    return new TestScriptImpl(null, data);
  }
}
