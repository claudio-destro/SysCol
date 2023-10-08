import {TestScriptError} from "../../script/TestScriptError";
import {TestConfirmOption} from "../../script/TestScript";

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

export const logCommand = async (_lineno: number, command: string): Promise<void> => {
  const row = document.createElement("p");
  row.className = "sys_col_command sys_col_row";
  row.innerText = command;
  appendRow(row);
};

export const logTest = async (lineno: number, response: string, passed: boolean, elapsed: number): Promise<void> => {
  const status = passed ? "pass" : "fail";
  await logCommandResponse(lineno, response, elapsed, status);
  tests[status]++;
};

const markPassed = <T extends HTMLElement>(row: T, status: string): T => {
  row.classList.toggle("test_pass", status === "pass");
  row.classList.toggle("test_fail", status === "fail");
  return row;
};

export const logCommandResponse = async (_lineno: number, response: string, elapsed: number, status?: "pass" | "fail"): Promise<void> => {
  const row = document.createElement("p");
  row.className = "sys_col_response sys_col_row";
  markPassed(row, status);
  const body = document.createElement("span");
  body.innerText = response.toString().trim();
  row.appendChild(body);
  const lap = document.createElement("span");
  lap.className = "sys_col_elapsed";
  lap.innerText = microsecondsToInstant(elapsed);
  row.appendChild(lap);
  appendRow(row);
};

export const logMessage = async (_lineno: number, type: "log" | "info" | "error" | "question" | "stack", message: string): Promise<void> => {
  message = (message ?? "").trim();
  const row = document.createElement("p");
  row.className = `sys_col_message sys_col_row ${type}`;
  if (message) row.innerText = message;
  else row.innerHTML = "&nbsp;";
  appendRow(row);
};

export const logStatus = async (status: string, clazz?: string[]): Promise<void> => {
  document.querySelectorAll("#sys_col_bar .sys_col_status").forEach((e: HTMLElement) => (e.innerHTML = status));
  if (clazz?.length) {
    document.querySelectorAll("#sys_col_bar").forEach(e => {
      const [unset, set] = clazz;
      if (unset) unset.split(/\s+/).forEach(clazz => e.classList.remove(clazz));
      if (set) set.split(/\s+/).forEach(clazz => e.classList.add(clazz));
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = async (lineno: number, err: TestScriptError): Promise<void> => {
  const {message, name, stack} = err;
  await logMessage(lineno, "error", `${name}: ${message}`);
  for (const {fileName, lineNumber} of stack) {
    await logMessage(lineno, "stack", `at ${fileName}:${lineNumber}`);
  }
};

export const clearLogs = async (): Promise<void> => {
  const log = document.getElementById("sys_col_log");
  log.innerHTML = "";
};

export const getTestResults = () => ({...tests});

export const confirm = async (lineno: number, timeout: number, prompt: string, ...options: TestConfirmOption[]): Promise<string> => {
  await logMessage(lineno, "question", prompt);
  const row = document.createElement("p");
  row.className = `sys_col_message sys_col_row`;
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () => {
        row.parentNode?.removeChild(row);
        reject(new Error("Timeout"));
      },
      Math.max(timeout, 30_000),
    );

    // const clearButtons = () => {
    //   clearTimeout(timeoutId);
    //   row.querySelectorAll('input[type="button"]').forEach((btn: HTMLInputElement) => {
    //     btn.disabled = true;
    //     btn.onclick = null;
    //   });
    // };

    for (const option of options) {
      const btn = document.createElement("input");
      btn.type = "button";
      btn.value = option.label;
      btn.onclick = () => {
        row.parentNode?.removeChild(row);
        logMessage(lineno, "question", `${option.label} - ${JSON.stringify(option.value)}`);
        clearTimeout(timeoutId);
        resolve(option.value);
      };
      row.append(btn);
    }
    appendRow(row);
  });
};
