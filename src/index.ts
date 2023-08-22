import {app, dialog, Menu, BrowserWindow, ipcMain} from "electron";
import {Events} from "./Events";
import {loadSettings, saveSettings} from "./settings";
import {executeScript, loadScript, reloadScript} from "./scripts";
import {createWindow} from "./createWindow";
import {platform} from "node:process";

const isMac = platform === "darwin";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

app.setName("SysCol");

app.on("ready", loadSettings);
app.on("before-quit", saveSettings);

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

ipcMain.on(Events.EXECUTE_SCRIPT, async () => executeScript(BrowserWindow.getFocusedWindow()));

const menu = Menu.buildFromTemplate([
  {role: "appMenu"},
  {
    label: "File",
    role: "fileMenu",
    submenu: [
      {
        label: "New window",
        accelerator: "CommandOrControl+N",
        click: () => createWindow(),
      },
      {
        label: "Open script",
        accelerator: "CommandOrControl+O",
        click: async () => {
          const window = BrowserWindow.getFocusedWindow();
          const result = await dialog.showOpenDialog(window, {
            title: "Choose test script",
            properties: ["openFile"],
            filters: [{name: "Script", extensions: ["tst", "txt"]}],
          });
          if (!result.canceled) {
            await loadScript(result.filePaths[0], window);
          }
        },
      },
      isMac ? {role: "close"} : {role: "quit"},
    ],
  },
  {role: "editMenu"},
  {
    label: "View",
    role: "viewMenu",
    submenu: [
      {
        label: "Reload",
        accelerator: "CommandOrControl+R",
        click: async () => {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.once("did-finish-load", () => reloadScript(window));
          window.reload();
        },
      },
    ],
  },
  {role: "windowMenu"},
  {role: "help"},
]);

Menu.setApplicationMenu(menu);
