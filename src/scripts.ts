import {TestScript} from "./script/TestScript";
import {Events} from "./Events";
import {BrowserWindow} from "electron";
import {PathOrFileDescriptor} from "node:fs";

const SCRIPTS: Record<number, {file: PathOrFileDescriptor; script: TestScript}> = {};

export const loadScript = async (file: PathOrFileDescriptor, window: BrowserWindow) => {
  console.log(`Load script ${JSON.stringify(file)} into window "${window.id}"`);
  const script = await TestScript.fromFile(file);
  window.webContents.send(Events.SET_SCRIPT_FILE_NAME, file);
  script.onScriptError = (err, lineno) => window.webContents.send(Events.ON_SCRIPT_ERROR, err, lineno);
  script.onLogMessage = str => window.webContents.send(Events.ON_LOG_MESSAGE, str);
  script.onLogCommand = (cmd, lineno) => window.webContents.send(Events.ON_LOG_COMMAND, cmd, lineno);
  script.onCommandError = (cmd, lineno) => window.webContents.send(Events.ON_COMMAND_ERROR, cmd, lineno);
  script.onCommandResponse = (str, elapsed, lineno) => window.webContents.send(Events.ON_COMMAND_RESPONSE, str, elapsed, lineno);
  script.onTestPassed = (str, elapsed, lineno) => window.webContents.send(Events.ON_TEST_PASSED, str, elapsed, lineno);
  script.onTestFailed = (str, elapsed, lineno) => window.webContents.send(Events.ON_TEST_FAILED, str, elapsed, lineno);
  window.on("closed", () => delete SCRIPTS[window.id]);
  SCRIPTS[window.id] = {file, script};
};

export const reloadScript = async (window: BrowserWindow) => {
  const file = SCRIPTS[window.id]?.file;
  if (file) await loadScript(file, window);
};

export const executeScript = async (window: BrowserWindow) => SCRIPTS[window.id]?.script.executeScript();

export const getAllScripts = () => Object.fromEntries(Object.entries(SCRIPTS).map(([windowId, scriptData]) => [windowId, {scriptFile: scriptData.file}]));
