import {BrowserWindow} from "electron";
import {TestScript} from "../../script/TestScript";
import {TestScriptBuilder} from "../../TestScriptBuilder";
import {TestScriptInterruptController} from "../../script/TestScriptInterruptController";
import {ElectronEnvironment} from "./ElectronEnvironment";
import {SysColCommandProtocol} from "../../protocols/SysColCommandProtocol";
import {makeTestScriptEventListenerFactory} from "./makeTestScriptEventListenerFactory";
import {makeTestScriptHandlerFactory} from "./makeTestScriptHandlerFactory";

const SCRIPTS: Record<number, {file: string; script: TestScript; controller: TestScriptInterruptController}> = {};

export const loadScript = async (file: string, window: BrowserWindow) => {
  if (file) {
    console.log(`Load script ${JSON.stringify(file)} into window "${window.id}"`);
    const builder: TestScriptBuilder = new TestScriptBuilder(new ElectronEnvironment(), new SysColCommandProtocol());
    const script: TestScript = await builder.loadTestScript(file);
    const controller: TestScriptInterruptController = await builder.attachInterruptController(script);
    window.webContents.send("setScriptFileName", "", "", file);
    const makeTestScriptEventListener = makeTestScriptEventListenerFactory(script, window);
    const makeTestScriptHandler = makeTestScriptHandlerFactory(script, window);
    script.confirm = makeTestScriptHandler("confirm");
    script.on("error", makeTestScriptEventListener("error"));
    script.on("message", makeTestScriptEventListener("message"));
    script.on("command", makeTestScriptEventListener("command"));
    script.on("response", makeTestScriptEventListener("response"));
    script.on("test", makeTestScriptEventListener("test"));
    script.on("start", makeTestScriptEventListener("start"));
    script.on("stop", makeTestScriptEventListener("stop"));
    window.on("closed", () => delete SCRIPTS[window.id]);
    SCRIPTS[window.id] = {file, script, controller};
  }
};

export const reloadScript = async (window: BrowserWindow) => {
  const file = SCRIPTS[window.id]?.file;
  if (file) await loadScript(file, window);
};

export const executeScript = async (window: BrowserWindow) => SCRIPTS[window.id]?.script.execute().catch(console.error);

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
