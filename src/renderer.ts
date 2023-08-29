/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

import {clearLogs, getTestResults, logCommand, logCommandResponse, logError, logMessage, logStatus, logTest} from "./index";

export const setScriptFileName = (file: string): void => {
  document.title = file;
  logStatus(file);
};

const logStarted = () => logStatus("Running...");

const logStopped = (): void => {
  const tests = getTestResults();
  logStatus(`Tests: ${tests.pass} passed, ${tests.pass + tests.fail} total`);
};

SysCol.registerEventListener("setScriptFileName", setScriptFileName);
SysCol.registerEventListener("clearLogs", clearLogs);
SysCol.registerEventListener("error", logError);
SysCol.registerEventListener("message", logMessage);
SysCol.registerEventListener("command", logCommand);
SysCol.registerEventListener("response", logCommandResponse);
SysCol.registerEventListener("test", logTest);
SysCol.registerEventListener("start", logStarted);
SysCol.registerEventListener("stop", logStopped);
