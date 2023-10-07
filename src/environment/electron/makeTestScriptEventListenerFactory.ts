import {TestScript} from "../../script/TestScript";
import {BrowserWindow} from "electron";
import {TestScriptEvent, TestScriptListeners} from "../../script/TestScriptEvents";

export const makeTestScriptEventListenerFactory = (script: TestScript, window: BrowserWindow) => {
  return <E extends TestScriptEvent>(event: E) =>
    (...args: Parameters<TestScriptListeners[E]>) =>
      window.webContents.send(event, "", "", script.lineNumber, ...args);
};
