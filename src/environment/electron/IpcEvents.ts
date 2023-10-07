import {TestScriptEvent, TestScriptListeners} from "../../script/TestScriptEvents";
import {TestConfirmOption} from "../../script/TestScript";

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
  clearLogs(): Promise<void>;
  confirm(timeout: number, prompt: string, ...options: TestConfirmOption[]): Promise<string>;
  interrupt(): Promise<void>;
  setScriptFileName(fileName: string): Promise<void>;
} & {
  [event in TestScriptEvent]: (lineno: number, ...arg: Parameters<TestScriptListeners[event]>) => Promise<ReturnType<TestScriptListeners[event]>>;
};

export type IpcRendererEvent = keyof IpcRendererEventListeners;

export type IpcRendererEventListenerMap = {
  [event in IpcRendererEvent]: IpcRendererEventListeners[event];
};
