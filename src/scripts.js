const {TestScript} = require("./script/TestScript");
const {
  EVENT_SET_SCRIPT_FILE_NAME,
  EVENT_ON_SCRIPT_ERROR,
  EVENT_ON_LOG_MESSAGE,
  EVENT_ON_LOG_COMMAND,
  EVENT_ON_COMMAND_ERROR,
  EVENT_ON_COMMAND_RESPONSE,
  EVENT_ON_TEST_PASSED,
  EVENT_ON_TEST_FAILED,
} = require("./Events");

const SCRIPTS = {};

const loadScript = async (file, window) => {
  console.log(`loadScript ${JSON.stringify(file)} into window "${window.id}"`);
  const script = await TestScript.fromFile(file);
  window.webContents.send(EVENT_SET_SCRIPT_FILE_NAME, file);
  script.onScriptError = (err, lineno) => window.webContents.send(EVENT_ON_SCRIPT_ERROR, err, lineno);
  script.onLogMessage = str => window.webContents.send(EVENT_ON_LOG_MESSAGE, str);
  script.onLogCommand = (cmd, lineno) => window.webContents.send(EVENT_ON_LOG_COMMAND, cmd, lineno);
  script.onCommandError = (cmd, lineno) => window.webContents.send(EVENT_ON_COMMAND_ERROR, cmd, lineno);
  script.onCommandResponse = (str, elapsed, lineno) => window.webContents.send(EVENT_ON_COMMAND_RESPONSE, str, elapsed, lineno);
  script.onTestPassed = (str, elapsed, lineno) => window.webContents.send(EVENT_ON_TEST_PASSED, str, elapsed, lineno);
  script.onTestFailed = (str, elapsed, lineno) => window.webContents.send(EVENT_ON_TEST_FAILED, str, elapsed, lineno);
  window.on("closed", () => delete SCRIPTS[window.id]);
  SCRIPTS[window.id] = {file, script};
};

const reloadScript = async window => {
  const file = SCRIPTS[window.id]?.file;
  if (file) await loadScript(file, window);
};

const executeScript = async window => SCRIPTS[window.id]?.script.executeScript();

const getAllScripts = () => Object.fromEntries(Object.entries(SCRIPTS).map(([windowId, scriptData]) => [windowId, {scriptFile: scriptData.file}]));

module.exports = {
  getAllScripts,
  executeScript,
  loadScript,
  reloadScript,
};
