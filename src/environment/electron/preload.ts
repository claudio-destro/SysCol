import {contextBridge, ipcRenderer} from "electron";
import {IpcRendererEvent, IpcRendererEventListenerMap} from "./IpcEvents";
import {SysColApi} from "./SysColApi";

type RegisteredEventMap = {
  [event in IpcRendererEvent]: Array<{
    callback: IpcRendererEventListenerMap[event];
    ipcListener: (event: Electron.IpcRendererEvent, responseChannel: string, errorChannel: string, ...parameters: Parameters<IpcRendererEventListenerMap[event]>) => Promise<void>;
  }>;
};

const REGISTERED_EVENTS: RegisteredEventMap = {
  setScriptFileName: [], // unused
  clearLogs: [], // unused
  confirm: [],
  interrupt: [],
  error: [],
  message: [],
  command: [],
  response: [],
  test: [],
  start: [],
  stop: [],
};

const SYS_COL_API: SysColApi = {
  executeScript: (): void => ipcRenderer.send("executeScript"),
  registerEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void {
    const ipcListener = async (event: Electron.IpcRendererEvent, responseChannel: string, errorChannel: string, ...parameters: Parameters<IpcRendererEventListenerMap[E]>) => {
      console.log(...parameters);
      try {
        const ret = await callback.call(null, ...parameters); // NOSONAR typescript:S6676
        event.sender.send(responseChannel, ret);
      } catch (e) {
        console.error(e);
        event.sender.send(errorChannel, e);
      }
    };
    REGISTERED_EVENTS[event].push({callback, ipcListener});
    ipcRenderer.on(event, ipcListener); // NOSONAR typescript:S654
  },
  unregisterEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void {
    REGISTERED_EVENTS[event]
      .filter(({callback: cb}) => callback === cb)
      .forEach(({ipcListener}) => {
        ipcRenderer.off(event, ipcListener); // NOSONAR typescript:S654
        // FIXME remove from registry
      });
  },
};

contextBridge.exposeInMainWorld("SysCol", SYS_COL_API);
