import {IpcRendererEvent, IpcRendererEventListenerMap} from "./IpcEvents";

export type SysColApi = {
  registerEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void;
  unregisterEventListener<E extends IpcRendererEvent>(event: E, callback: IpcRendererEventListenerMap[E]): void;
  executeScript(): void;
};

declare global {
  export interface Window {
    SysCol: SysColApi;
  }
}
