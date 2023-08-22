const {app, dialog, Menu, BrowserWindow, ipcMain} = require("electron");
const {EVENT_EXECUTE_SCRIPT} = require("./Events");
const {loadSettings, saveSettings} = require("./settings");
const {executeScript, loadScript, reloadScript} = require("./scripts");
const {createWindow} = require("./createWindow");

const isMac = process.platform === "darwin";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

app.setName("SysCol");

app.on("ready", loadSettings);
app.on("before-quit", saveSettings);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

ipcMain.on(EVENT_EXECUTE_SCRIPT, async () => executeScript(BrowserWindow.getFocusedWindow()));

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const template = [
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
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
