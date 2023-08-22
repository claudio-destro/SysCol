import {BrowserWindow} from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type BrowserWindowRect = {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

export const createWindow = async ({x, y, width, height}: BrowserWindowRect = {width: 800, height: 600}) => {
  const mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      // sandbox: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.webContents.openDevTools();
  return mainWindow;
};
