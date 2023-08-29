import {TestScriptEvent, TestScriptListeners} from "./script/TestScriptEvents";

/*
 * Events from renderer to main
 */

export interface IpcMainEventListeners {
  executeScript(): void;
}

export type IpcMainEvent = keyof IpcMainEventListeners;

export type IpcMainEventListenerMap = {
  [event in IpcMainEvent]: IpcMainEventListeners[event];
};

/*
 * Events from main to renderer
 */

export type IpcRendererEventListeners = {
  clearLogs(): void;
  interrupt(): void;
  setScriptFileName(fileName: string): void;
} & {
  [event in TestScriptEvent]: (lineno: number, ...arg: Parameters<TestScriptListeners[event]>) => void;
};

export type IpcRendererEvent = keyof IpcRendererEventListeners;

export type IpcRendererEventListenerMap = {
  [event in IpcRendererEvent]: IpcRendererEventListeners[event];
};
