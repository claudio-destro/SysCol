import {app, BrowserWindow, dialog, Menu} from "electron";
import {platform} from "node:process";
import {executeScript, interruptScript, loadScript, reloadScript} from "./scripts";
import {createWindow} from "./createWindow";
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

const isMac = platform === "darwin";
const isWin = platform === "win32";

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
    window.webContents.once("did-finish-load", () => {
      reloadScript(window)
        .then(() => executeScript(window))
        .catch(console.error);
    });
    window.reload();
  }
};

const template: Array<MenuItemConstructorOptions> = [
  {
    role: "fileMenu",
    submenu: [
      {
        id: "newScript",
        label: "New Window",
        accelerator: "CommandOrControl+N",
        click: () => {
          loadScriptAndOpenWindowIfNecessary().catch(console.error);
        },
      },
      {
        id: "openScript",
        label: "Open Script",
        accelerator: "CommandOrControl+O",
        click: () => {
          loadScriptAndOpenWindowIfNecessary(BrowserWindow.getFocusedWindow()).catch(console.error);
        },
      },
      isMac ? {role: "close"} : {role: "quit"},
    ],
  },
  {role: "editMenu"},
  {
    label: "Script",
    submenu: [
      {
        id: "executeScript",
        label: "Run",
        accelerator: "CommandOrControl+R",
        click: () => reloadAndExecuteScript(BrowserWindow.getFocusedWindow()),
      },
      {
        id: "interruptScript",
        label: "Interrupt",
        accelerator: isMac ? "Command+." : "F8",
        click: () => {
          interruptScript(BrowserWindow.getFocusedWindow()).catch(console.error);
        },
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

if (isWin) template.push({role: "help", submenu: [{role: "about"}]});

const menu = Menu.buildFromTemplate(template);
export const createMenu = (): void => Menu.setApplicationMenu(menu);

const setMenuItemsEnabled = (enabled: boolean): void => {
  menu.getMenuItemById("executeScript").enabled = enabled;
  menu.getMenuItemById("openScript").enabled = enabled;
};

app.on("window-all-closed", () => setMenuItemsEnabled(false));
app.on("browser-window-created", () => setMenuItemsEnabled(true));
