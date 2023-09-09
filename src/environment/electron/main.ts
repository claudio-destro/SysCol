import {app, BrowserWindow, ipcMain} from "electron";
import {platform} from "node:process";
import {loadSettings, saveSettings} from "./settings";
import {executeScript} from "./scripts";
import {createMenu} from "./menu";
import {IpcMainEvent, IpcMainEventListenerMap} from "./IpcEvents";
import {createWindow} from "./createWindow";

const isMac = platform === "darwin";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

app.setName("SysCol");
app.commandLine.appendSwitch("lang", "en");

app.on("ready", loadSettings);
app.on("before-quit", saveSettings);
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch(console.error);
  }
});

const registerIpcMainListener = <E extends IpcMainEvent>(event: E, listener: IpcMainEventListenerMap[E]): void => {
  ipcMain.on(event, listener);
};

registerIpcMainListener("executeScript", () => {
  const window: BrowserWindow | null = BrowserWindow.getFocusedWindow();
  if (window) executeScript(window).catch(console.error);
});

createMenu();
