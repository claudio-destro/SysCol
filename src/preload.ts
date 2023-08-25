import {contextBridge, ipcRenderer} from "electron";
import {IpcRendererEvent, IpcRendererEventListenerMap} from "./IpcEvents";
import {SysColApi} from "./SysColApi";

type RegisteredEventMap = {
  [event in IpcRendererEvent]: Array<{
    callback: IpcRendererEventListenerMap[event];
    ipcListener: (_event: Electron.IpcRendererEvent, ...args: Parameters<IpcRendererEventListenerMap[event]>) => void;
  }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTERED_EVENTS: RegisteredEventMap = {
  clearLogs: [], // unused
  setScriptFileName: [], // unused
  error: [],
  message: [],
  command: [],
  response: [],
  test: [],
};

const SYS_COL_API: SysColApi = {
  executeScript: (): void => ipcRenderer.send("executeScript"),
  registerEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void {
    const ipcListener = (_event: Electron.IpcRendererEvent, ...args: Parameters<IpcRendererEventListenerMap[E]>) => callback.call(null, ...args);
    REGISTERED_EVENTS[event].push({callback, ipcListener});
    ipcRenderer.on(event, ipcListener);
  },
  unregisterEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void {
    REGISTERED_EVENTS[event]
      .filter(({callback: cb}) => callback === cb)
      .forEach(({ipcListener}) => {
        ipcRenderer.off(event, ipcListener);
        // FIXME remove from registry
      });
  },
};

contextBridge.exposeInMainWorld("SysCol", SYS_COL_API);
