const {contextBridge, ipcRenderer} = require("electron");
const {
  EVENT_SET_SCRIPT_FILE_NAME,
  EVENT_ON_SCRIPT_ERROR,
  EVENT_ON_LOG_MESSAGE,
  EVENT_ON_LOG_COMMAND,
  EVENT_ON_COMMAND_ERROR,
  EVENT_ON_COMMAND_RESPONSE,
  EVENT_ON_TEST_PASSED,
  EVENT_ON_TEST_FAILED,
  EVENT_EXECUTE_SCRIPT,
} = require("./Events");

contextBridge.exposeInMainWorld("SysCol", {
  onSetScriptFile: callback => ipcRenderer.on(EVENT_SET_SCRIPT_FILE_NAME, (_event, file) => callback(file)),
  onScriptError: callback => ipcRenderer.on(EVENT_ON_SCRIPT_ERROR, (_event, err, lineno) => callback(err, lineno)),
  onLogMessage: callback => ipcRenderer.on(EVENT_ON_LOG_MESSAGE, (_event, message) => callback(message)),
  onLogCommand: callback => ipcRenderer.on(EVENT_ON_LOG_COMMAND, (_event, message, lineno) => callback(message, lineno)),
  onCommandError: callback => ipcRenderer.on(EVENT_ON_COMMAND_ERROR, (_event, message, lineno) => callback(message, lineno)),
  onCommandResponse: callback => ipcRenderer.on(EVENT_ON_COMMAND_RESPONSE, (_event, message, elapsed, lineno) => callback(message, elapsed, lineno)),
  onTestPassed: callback => ipcRenderer.on(EVENT_ON_TEST_PASSED, (_event, message, elapsed, lineno) => callback(message, elapsed, lineno)),
  onTestFailed: callback => ipcRenderer.on(EVENT_ON_TEST_FAILED, (_event, message, elapsed, lineno) => callback(message, elapsed, lineno)),
  executeScript: () => ipcRenderer.send(EVENT_EXECUTE_SCRIPT),
});
