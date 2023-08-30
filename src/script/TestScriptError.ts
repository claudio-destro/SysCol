import {TestScript} from "./TestScript";

export type TestScriptErrorName = "INTERRUPT_ERROR" | "SYNTAX_ERROR" | "TIMEOUT_ERROR";

export class TestScriptError {
  stack: Array<{fileName?: string | null, lineNumber: number}> = [];

  constructor(public message: string, public name: TestScriptErrorName) {
    /* EMPTY */
  }

  addScript(script: TestScript): boolean {
    this.stack.push({
      fileName: script.filePath?.toString(),
      lineNumber: script.lineNumber,
    });
    return this.stack.length === 1;
  }

  toString(): string {
    return `${this.name}: ${this.message}\n${this.stack.map(({fileName, lineNumber}) => `\tat ${fileName}:${lineNumber}`).join("\n")}`;
  }
}