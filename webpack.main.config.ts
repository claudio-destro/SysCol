import type {Configuration} from "webpack";

import {rules} from "./webpack.rules";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  node: {
    __dirname: true,
  },
  externals: {
    // XXX Node SerialPort must be externalized. See https://stackoverflow.com/questions/71930401/webpack-not-including-module-with-electron-forge-and-serialport for more.
    serialport: true,
  },
};
