import {BrowserWindow} from "electron";
import {PathLike} from "node:fs";
import {TestScript} from "./script/TestScript";
import {TestScriptEvent, TestScriptListenerMap} from "./script/TestScriptEvents";
import {TestScriptFactory} from "./script/TestScriptFactory";

const SCRIPTS: Record<number, {file: PathLike; script: TestScript}> = {};

const makeTestScriptEventListenerFactory = (script: TestScript, window: BrowserWindow) => {
  return <E extends TestScriptEvent>(event: E) => {
    // XXX prepend line number to every post
    return (...args: Parameters<TestScriptListenerMap[E]>) => window.webContents.send(event, script.lineNumber, ...args);
  };
};

export const loadScript = async (file: PathLike, window: BrowserWindow) => {
  console.log(`Load script ${JSON.stringify(file)} into window "${window.id}"`);
  const script = await TestScriptFactory.fromFile(file);
  window.webContents.send("setScriptFileName", file);
  const makeTestScriptEventListener = makeTestScriptEventListenerFactory(script, window);
  script.on("error", makeTestScriptEventListener("error"));
  script.on("message", makeTestScriptEventListener("message"));
  script.on("command", makeTestScriptEventListener("command"));
  script.on("response", makeTestScriptEventListener("response"));
  script.on("test", makeTestScriptEventListener("test"));
  script.on("start", makeTestScriptEventListener("start"));
  script.on("end", makeTestScriptEventListener("end"));
  window.on("closed", () => delete SCRIPTS[window.id]);
  SCRIPTS[window.id] = {file, script};
};

export const reloadScript = async (window: BrowserWindow) => {
  const file = SCRIPTS[window.id]?.file;
  if (file) await loadScript(file, window);
};

export const executeScript = async (window: BrowserWindow) => SCRIPTS[window.id]?.script.executeScript();

export const getAllScripts = () => Object.fromEntries(Object.entries(SCRIPTS).map(([windowId, scriptData]) => [windowId, {scriptFile: scriptData.file}]));
