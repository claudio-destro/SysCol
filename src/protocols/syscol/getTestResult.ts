import {CommandResponseArgument} from "../../script/CommandResponse";
import {TestOutCome, TestResult} from "../../script/CommandProtocol";

export const getTestResult = (argv: Array<CommandResponseArgument>): TestResult => {
  const outcome = argv.filter(status => /FAIL|PASS/.test(status.value));
  return outcome?.length === 1 ? {test: outcome[0].key, result: outcome[0].value as TestOutCome} : {};
};

export const isTestFailed = (params: Array<CommandResponseArgument>): boolean => getTestResult(params).result === "FAIL";

export const isTestPassed = (params: Array<CommandResponseArgument>): boolean => getTestResult(params).result === "PASS";
