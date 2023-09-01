import {BrowserWindow} from "electron";
import {TestScript} from "./script/TestScript";
import {TestScriptEvent, TestScriptListenerMap} from "./script/TestScriptEvents";
import {TestScriptBuilderImpl} from "./TestScriptBuilderImpl";
import {TestScriptInterruptControllerImpl} from "./script/TestScriptInterruptControllerImpl";
import {TestScriptInterruptController} from "./script/TestScriptInterruptController";
import {TestScriptBuilder} from "./script/TestScriptBuilder";

const SCRIPTS: Record<number, {file: string; script: TestScript; controller: TestScriptInterruptController}> = {};

const makeTestScriptEventListenerFactory = (script: TestScript, window: BrowserWindow) => {
  return <E extends TestScriptEvent>(event: E) => {
    // XXX prepend line number to every post
    return (...args: Parameters<TestScriptListenerMap[E]>) => window.webContents.send(event, script.lineNumber, ...args);
  };
};

export const loadScript = async (file: string, window: BrowserWindow) => {
  console.log(`Load script ${JSON.stringify(file)} into window "${window.id}"`);
  const builder: TestScriptBuilder = new TestScriptBuilderImpl();
  const script: TestScript = await builder.fromFile(file);
  const controller: TestScriptInterruptController = new TestScriptInterruptControllerImpl();
  script.signal = controller.signal;
  window.webContents.send("setScriptFileName", file);
  const makeTestScriptEventListener = makeTestScriptEventListenerFactory(script, window);
  script.on("error", makeTestScriptEventListener("error"));
  script.on("message", makeTestScriptEventListener("message"));
  script.on("command", makeTestScriptEventListener("command"));
  script.on("response", makeTestScriptEventListener("response"));
  script.on("test", makeTestScriptEventListener("test"));
  script.on("start", makeTestScriptEventListener("start"));
  script.on("stop", makeTestScriptEventListener("stop"));
  window.on("closed", () => delete SCRIPTS[window.id]);
  SCRIPTS[window.id] = {file, script, controller};
};

export const reloadScript = async (window: BrowserWindow) => {
  const file = SCRIPTS[window.id]?.file;
  if (file) await loadScript(file, window);
};

export const executeScript = async (window: BrowserWindow) => SCRIPTS[window.id]?.script.execute().catch(e => console.error(e.toString()));

export const interruptScript = async (window: BrowserWindow) => {
  const store = SCRIPTS[window.id];
  if (store) {
    const {script, controller} = store;
    if (script.readyState === "running") {
      window.webContents.send("interrupt");
      controller.interrupt();
    }
  }
};

export const getAllScripts = () => Object.fromEntries(Object.entries(SCRIPTS).map(([windowId, scriptData]) => [windowId, {scriptFile: scriptData.file}]));
