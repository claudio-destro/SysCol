import {TestScript} from "./TestScript";

export type TestScriptErrorName = "FileError" | "HardwareError" | "InterruptError" | "InvocationError" | "SyntaxError" | "TimeoutError";

export class TestScriptError {
  stack: Array<{fileName?: string | null; lineNumber: number}> = [];

  constructor(
    public message: string,
    public name: TestScriptErrorName,
    public cause?: Error,
  ) {
    /* EMPTY */
  }

  addScript(script: TestScript): void {
    this.stack.push({
      fileName: script.filePath?.toString(),
      lineNumber: script.lineNumber,
    });
  }

  toString(): string {
    const stack = this.stack.map(({fileName, lineNumber}) => `\tat ${fileName}:${lineNumber}`);
    return `${this.name}: ${this.message}\n${stack.join("\n")}`;
  }
}
