import {app, BrowserWindow, dialog, Menu} from "electron";
import {platform} from "node:process";
import {executeScript, loadScript, reloadScript} from "./scripts";
import {createWindow} from "./createWindow";
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

const isMac = platform === "darwin";

const loadScriptAndOpenWindowIfNecessary = async (window?: BrowserWindow | null): Promise<void> => {
  const result = await dialog.showOpenDialog(window, {
    properties: ["openFile"],
    filters: [{name: "Script", extensions: ["tst", "txt"]}],
  });
  if (!result.canceled) {
    await loadScript(result.filePaths[0], window ?? (await createWindow()));
  }
};

const reloadAndExecuteScript = (window?: BrowserWindow | null): void => {
  if (window) {
    window.webContents.once("did-finish-load", () => reloadScript(window).then(() => executeScript(window)));
    window.reload();
  }
};

// const clearLogs = (window: BrowserWindow | null): void => window?.webContents.send("clearLogs");

const template: Array<MenuItemConstructorOptions> = [
  {
    role: "fileMenu",
    submenu: [
      {
        id: "newScript",
        label: "New Window",
        accelerator: "CommandOrControl+N",
        click: () => loadScriptAndOpenWindowIfNecessary(),
      },
      {
        id: "openScript",
        label: "Open Script",
        accelerator: "CommandOrControl+O",
        click: () => loadScriptAndOpenWindowIfNecessary(BrowserWindow.getFocusedWindow()),
      },
      isMac ? {role: "close"} : {role: "quit"},
    ],
  },
  {role:"editMenu"},
  {
    label: "Script",
    submenu: [
      {
        id: "executeScript",
        label: "Run",
        accelerator: "CommandOrControl+R",
        click: () => reloadAndExecuteScript(BrowserWindow.getFocusedWindow()),
      },
      // {
      //   id: "clearLogs",
      //   label: "Clear",
      //   accelerator: isMac ? "Command+K" : "Control+L",
      //   click: () => clearLogs(BrowserWindow.getFocusedWindow()),
      // },
    ],
  },
  {role: "windowMenu"},
];

if (isMac) template.unshift({role: "appMenu"});

const menu = Menu.buildFromTemplate(template);
export const createMenu = (): void => Menu.setApplicationMenu(menu);

const setMenuItemsEnabled = (enabled: boolean): void => {
  // menu.getMenuItemById("clearLogs").enabled = enabled;
  menu.getMenuItemById("executeScript").enabled = enabled;
  menu.getMenuItemById("openScript").enabled = enabled;
};

app.on("window-all-closed", () => setMenuItemsEnabled(false));
app.on("browser-window-created", () => setMenuItemsEnabled(true));
