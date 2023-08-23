import {TestScriptEvent, TestScriptListeners} from "./script/TestScriptEvents";

export interface IpcMainEventListeners {
  executeScript(): void;
}

export type IpcMainEvent = keyof IpcMainEventListeners;

export type IpcMainEventListenerMap = {
  [event in IpcMainEvent]: IpcMainEventListeners[event];
};

export type IpcRendererEventListeners = {
  setScriptFileName(fileName: string): void;
} & {
  [event in TestScriptEvent]: (lineno: number, ...arg: Parameters<TestScriptListeners[event]>) => void;
};

export type IpcRendererEvent = keyof IpcRendererEventListeners;

export type IpcRendererEventListenerMap = {
  [event in IpcRendererEvent]: IpcRendererEventListeners[event];
};
