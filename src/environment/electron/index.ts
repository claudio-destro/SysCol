import {TestScriptError} from "../../script/TestScriptError";

const tests = {pass: 0, fail: 0};

const microsecondsToInstant = (time: number): string => {
  if (time < 1) return "";
  if (time < 1000) return `[${time.toFixed(0)}μs]`;
  time /= 1000;
  if (time < 1000) return `[${time.toFixed(0)}ms]`;
  time /= 1000;
  return `[${time.toFixed(1)}s]`;
};

const appendRow = (row: HTMLElement): void => {
  const log = document.getElementById("sys_col_log");
  log.appendChild(row);
  log.scrollTo({top: log.scrollHeight});
};

export const logCommand = (_lineno: number, command: string): void => {
  const row = document.createElement("p");
  row.className = "sys_col_command sys_col_row";
  row.innerText = command;
  appendRow(row);
};

export const logTest = (lineno: number, response: string, passed: boolean, elapsed: number): void => {
  const status = passed ? "pass" : "fail";
  logCommandResponse(lineno, response, elapsed, status);
  tests[status]++;
};

export const logCommandResponse = (_lineno: number, response: string, elapsed: number, status?: "pass" | "fail"): void => {
  const row = document.createElement("p");
  row.className = "sys_col_response sys_col_row";
  row.classList.toggle("test_pass", status === "pass");
  row.classList.toggle("test_fail", status === "fail");
  const body = document.createElement("span");
  body.innerText = response.toString().trim();
  row.appendChild(body);
  const lap = document.createElement("span");
  lap.className = "sys_col_elapsed";
  lap.innerText = microsecondsToInstant(elapsed);
  row.appendChild(lap);
  appendRow(row);
};

export const logMessage = (_lineno: number, type: "log" | "info" | "error" | "stack", message: string): void => {
  message = (message ?? "").trim();
  const row = document.createElement("p");
  row.className = `sys_col_message sys_col_row ${type}`;
  if (message) row.innerText = message;
  else row.innerHTML = "&nbsp;";
  appendRow(row);
};

export const logStatus = (status: string, clazz?: string[]): void => {
  document.querySelectorAll("#sys_col_bar .sys_col_status").forEach((e: HTMLElement) => (e.innerHTML = status));
  if (clazz?.length) {
    document.querySelectorAll("#sys_col_bar").forEach(e => {
      const [unset, set] = clazz;
      if (unset) e.classList.remove(unset);
      if (set) e.classList.add(set);
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (lineno: number, err: TestScriptError): void => {
  const {message, name, stack} = err;
  logMessage(lineno, "error", `${name}: ${message}`);
  for (const {fileName, lineNumber} of stack) {
    logMessage(lineno, "stack", `at ${fileName}:${lineNumber}`);
  }
};

export const clearLogs = (): void => {
  const log = document.getElementById("sys_col_log");
  log.innerHTML = "";
};

export const getTestResults = () => ({...tests});
