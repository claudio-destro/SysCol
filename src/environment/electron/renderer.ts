import "../../index.css";

import {clearLogs, confirm, getTestResults, interrupt, logCommand, logCommandResponse, logError, logMessage, logStatus, logTest} from "./index";

export const setScriptFileName = async (file: string): Promise<void> => {
  document.title = file;
  await clearLogs();
  return logStatus(file, ["tests-failed tests-passed"]);
};

const logStarted = async (): Promise<void> => logStatus("Running...");

const logStopped = async (): Promise<void> => {
  const tests = getTestResults();
  if (tests.fail) {
    return logStatus(`Tests: ${tests.fail} failed, ${tests.pass + tests.fail} total`, ["tests-passed", "tests-failed"]);
  }
  if (tests.pass) {
    return logStatus(`Tests: ${tests.pass} passed`, ["tests-failed", "tests-passed"]);
  }
  return logStatus("No tests");
};

SysCol.registerEventListener("setScriptFileName", setScriptFileName);
SysCol.registerEventListener("clearLogs", clearLogs);
SysCol.registerEventListener("confirm", confirm);
SysCol.registerEventListener("error", logError);
SysCol.registerEventListener("interrupt", interrupt);
SysCol.registerEventListener("message", logMessage);
SysCol.registerEventListener("command", logCommand);
SysCol.registerEventListener("response", logCommandResponse);
SysCol.registerEventListener("test", logTest);
SysCol.registerEventListener("start", logStarted);
SysCol.registerEventListener("stop", logStopped);
