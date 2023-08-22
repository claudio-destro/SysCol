import {contextBridge, ipcRenderer} from "electron";
import {Events} from "./Events";
import {SysColApi} from "./SysColApi";
import IpcRendererEvent = Electron.IpcRendererEvent;

export type SysColIpc = {
  [F in keyof SysColApi]: (callback: SysColApi[F]) => void;
};

type RendererEventCallbacks = {
  [Events.SET_SCRIPT_FILE_NAME]: (...args: Parameters<SysColApi["onSetScriptFileName"]>) => void;
  [Events.ON_SCRIPT_ERROR]: (...args: Parameters<SysColApi["onScriptError"]>) => void;
  [Events.ON_LOG_MESSAGE]: (...args: Parameters<SysColApi["onLogMessage"]>) => void;
  [Events.ON_LOG_COMMAND]: (...args: Parameters<SysColApi["onLogCommand"]>) => void;
  [Events.ON_COMMAND_ERROR]: (...args: Parameters<SysColApi["onCommandError"]>) => void;
  [Events.ON_COMMAND_RESPONSE]: (...args: Parameters<SysColApi["onCommandResponse"]>) => void;
  [Events.ON_TEST_PASSED]: (...args: Parameters<SysColApi["onTestPassed"]>) => void;
  [Events.ON_TEST_FAILED]: (...args: Parameters<SysColApi["onTestFailed"]>) => void;
};

function registerEvent<E extends keyof RendererEventCallbacks>(event: E, callback: RendererEventCallbacks[E]): void {
  ipcRenderer.on(event, (_event: IpcRendererEvent, ...args: Parameters<RendererEventCallbacks[E]>) => callback.call(null, ...args));
}

contextBridge.exposeInMainWorld("SysCol", {
  onSetScriptFileName: (callback: (name: string) => void): void => registerEvent(Events.SET_SCRIPT_FILE_NAME, callback),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScriptError: (callback: (error: any, lineno: number) => void): void => registerEvent(Events.ON_SCRIPT_ERROR, callback),
  onLogMessage: (callback: (message: string) => void): void => registerEvent(Events.ON_LOG_MESSAGE, callback),
  onLogCommand: (callback: (command: string, lineno: number) => void): void => registerEvent(Events.ON_LOG_COMMAND, callback),
  onCommandError: (callback: (command: string, lineno: number) => void): void => registerEvent(Events.ON_COMMAND_ERROR, callback),
  onCommandResponse: (callback: (command: string, elapsed: number, lineno: number) => void): void => registerEvent(Events.ON_COMMAND_RESPONSE, callback),
  onTestPassed: (callback: (command: string, elapsed: number, lineno: number) => void): void => registerEvent(Events.ON_TEST_PASSED, callback),
  onTestFailed: (callback: (command: string, elapsed: number, lineno: number) => void): void => registerEvent(Events.ON_TEST_FAILED, callback),
  executeScript: (): void => ipcRenderer.send(Events.EXECUTE_SCRIPT),
} satisfies SysColIpc);
