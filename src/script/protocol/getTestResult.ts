export type TestResult = {test?: string; result?: "FAIL" | "PASS"};

export const getTestResult = (argv: Record<string, string>): TestResult => {
  const outcome = Object.entries(argv).filter(([, status]) => status.match(/FAIL|PASS/))[0] ?? [];
  return {test: outcome[0], result: outcome[1] as "FAIL" | "PASS"};
};

export const isTestFailed = (params: Record<string, string>): boolean => getTestResult(params).result === "FAIL";

export const isTestPassed = (params: Record<string, string>): boolean => getTestResult(params).result === "PASS";
