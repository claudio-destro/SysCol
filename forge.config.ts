import type {ForgeConfig, ResolvedForgeConfig} from "@electron-forge/shared-types";
import {MakerZIP} from "@electron-forge/maker-zip";
import {AutoUnpackNativesPlugin} from "@electron-forge/plugin-auto-unpack-natives";
import {WebpackPlugin} from "@electron-forge/plugin-webpack";
import {spawn} from "node:child_process";

import {mainConfig} from "./webpack.main.config";
import {rendererConfig} from "./webpack.renderer.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readPackageJson = async (_forgeConfig: ResolvedForgeConfig, packageJson: Record<string, any>): Promise<Record<string, any>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {scripts, ...pkg} = packageJson;
  return pkg;
};

const packageAfterPrune = async (_forgeConfig: ResolvedForgeConfig, buildPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const npmInstall = spawn("npm", ["install", "--omit", "dev"], {
      cwd: buildPath,
      stdio: "ignore",
      shell: true,
    });
    npmInstall.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Npm exited with error ${code} `));
      }
    });
    npmInstall.on("error", reject);
  });
};

const config: ForgeConfig = {
  // XXX Since Node SerialPort is listed as external, it will be pruned during packaging process. Therefore, include hooks during build process.
  // See https://stackoverflow.com/questions/71930401/webpack-not-including-module-with-electron-forge-and-serialport for more.
  hooks: {
    readPackageJson,
    packageAfterPrune,
  },
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}, ["darwin", "win32"])],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
