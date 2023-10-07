import {CommandResponse, CommandResponseArgument, TestResponse} from "./CommandResponse";
import {Command} from "./Command";

export type TestOutCome = "FAIL" | "PASS";

export type TestResult = {test?: string; result?: TestOutCome};

export interface CommandProtocol {
  getTestResult(argv: Array<CommandResponseArgument>): TestResult;
  isTestFailed(params: Array<CommandResponseArgument>): boolean;
  isTestPassed(params: Array<CommandResponseArgument>): boolean;
  parseCommand(str: string, macroPrefix?: string): Command;
  parseCommandResponse(str: string): CommandResponse;
  parseTestResponse(str: string): TestResponse;
  stringifyHardwareCommand(cmd: string, ...args: Array<string>): string;
  stringifyHardwareCommandResponse(cmd: string, ...args: Array<string>): string;
  stringifyTestCommandResponse(testId: string, pass: boolean): string;
}
