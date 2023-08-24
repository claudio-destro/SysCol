export type TestResult = "FAIL" | "PASS";

export type TestOutcome = {test?: string; result?: TestResult};

export const getTestResult = (params: Record<string, string>): TestOutcome => {
  const outcome = Object.entries(params).filter(([, status]) => status.match(/FAIL|PASS/))[0] ?? [];
  return {test: outcome[0], result: outcome[1] as TestResult};
};

export const isTestFailed = (params: Record<string, string>): boolean => getTestResult(params).result === "FAIL";

export const isTestPassed = (params: Record<string, string>): boolean => getTestResult(params).result === "PASS";
