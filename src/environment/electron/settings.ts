import {BrowserWindow} from "electron";
import Store from "electron-store";
import {getAllScripts, loadScript} from "./scripts";
import {createWindow} from "./createWindow";

const SETTINGS_SCRIPTS_KEY = "scripts";

type SysColScriptSettings = Array<{
  scriptFile?: string;
  windowPosition: {x?: number; y?: number; width: number; height: number};
}>;

type SysColSettings = {
  [SETTINGS_SCRIPTS_KEY]: SysColScriptSettings;
};

const store = new Store<SysColSettings>();

const getScripts = (): SysColScriptSettings => {
  const data: SysColScriptSettings = store.get(SETTINGS_SCRIPTS_KEY, []);
  return data.length === 0 ? [{windowPosition: {width: 800, height: 600}}] : data;
};

export const loadSettings = () => {
  const data: SysColScriptSettings = getScripts();
  console.log(`Load settings from "${store.path}"`);
  for (const windowSettings of data) {
    const {scriptFile, windowPosition} = windowSettings;
    createWindow(windowPosition).then(window => loadScript(scriptFile, window));
  }
};

export const saveSettings = (): void => {
  const scripts = getAllScripts();
  const data: SysColScriptSettings = BrowserWindow.getAllWindows().map(window => {
    const [x, y] = window.getPosition();
    const [width, height] = window.getSize();
    return {
      ...scripts[window.id],
      windowPosition: {x, y, width, height},
    };
  });
  store.set(SETTINGS_SCRIPTS_KEY, data);
  console.log(`Save settings to "${store.path}"`);
};
