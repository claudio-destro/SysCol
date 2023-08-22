const {BrowserWindow} = require("electron");
const Store = require("electron-store");
const {getAllScripts, loadScript} = require("./scripts");
const {createWindow} = require("./createWindow");

const store = new Store();

const SETTINGS_SCRIPTS_KEY = "scripts";

const getScripts = () => {
  const data = store.get(SETTINGS_SCRIPTS_KEY, []);
  return data.length === 0 ? [{width: 800, height: 600}] : data;
};

const loadSettings = () => {
  const data = getScripts();
  console.log(`loadSettings from "${store.path}"`);
  console.dir(data);
  for (const windowSettings of data) {
    const {scriptFile, windowPosition} = windowSettings;
    createWindow(windowPosition).then(window => loadScript(scriptFile, window));
  }
};

const saveSettings = () => {
  const scripts = getAllScripts();
  const data = BrowserWindow.getAllWindows().map(window => {
    const [x, y] = window.getPosition();
    const [width, height] = window.getSize();
    return {
      ...scripts[window.id],
      windowPosition: {x, y, width, height},
    };
  });
  store.set(SETTINGS_SCRIPTS_KEY, data);
  console.log(`saveSettings to "${store.path}"`);
  console.dir(data);
};

module.exports = {
  loadSettings,
  saveSettings,
};
