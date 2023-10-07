import {TestConfirmFunction, TestScript} from "../../script/TestScript";
import {BrowserWindow, ipcMain} from "electron";
import crypto from "node:crypto";

interface SyncHandlers {
  confirm: TestConfirmFunction;
}

type SyncHandlersName = keyof SyncHandlers;

export type SyncHandlersMap = {
  [event in SyncHandlersName]: SyncHandlers[event];
};

export const makeTestScriptHandlerFactory = (script: TestScript, window: BrowserWindow) => {
  return <T extends SyncHandlersName, R = ReturnType<SyncHandlersMap[T]>>(event: T) => {
    return (...args: Parameters<SyncHandlersMap[T]>): Promise<R> => {
      return new Promise((resolve, reject) => {
        const errorChannel: string = crypto.randomUUID();
        const responseChannel: string = crypto.randomUUID();

        const onResponse = (_event: Electron.IpcMainEvent, ret: R): void => {
          ipcMain.off(errorChannel, onError);
          resolve(ret);
        };

        const onError = (_event: Electron.IpcMainEvent, err: Error): void => {
          ipcMain.off(responseChannel, onResponse);
          reject(err);
        };

        ipcMain.once(responseChannel, onResponse);
        ipcMain.once(errorChannel, onError);

        window.webContents.send(event, responseChannel, errorChannel, script.lineNumber, ...args);
      });
    };
  };
};
