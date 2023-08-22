const {BrowserWindow} = require("electron");
const path = require("path");

const createWindow = async ({x, y, width, height} = {width: 800, height: 600}) => {
  const mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  await mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools();
  return mainWindow;
};

module.exports = {
  createWindow,
};
