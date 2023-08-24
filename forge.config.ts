import type {ForgeConfig, ResolvedForgeConfig} from "@electron-forge/shared-types";
import {MakerSquirrel} from "@electron-forge/maker-squirrel";
import {MakerZIP} from "@electron-forge/maker-zip";
import {MakerDeb} from "@electron-forge/maker-deb";
import {MakerRpm} from "@electron-forge/maker-rpm";
import {AutoUnpackNativesPlugin} from "@electron-forge/plugin-auto-unpack-natives";
import {WebpackPlugin} from "@electron-forge/plugin-webpack";
import {PathOrFileDescriptor, readFileSync} from "node:fs";
import {spawn} from "node:child_process";
import * as path from "node:path";

import {mainConfig} from "./webpack.main.config";
import {rendererConfig} from "./webpack.renderer.config";

const readJson = <T>(path: PathOrFileDescriptor): T => JSON.parse(readFileSync(path).toString());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readPackageJson = async (_forgeConfig: ResolvedForgeConfig, packageJson: Record<string, any>): Promise<Record<string, any>> => {
  if (Object.keys(packageJson.dependencies).length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalPackageJson: Record<string, any> = readJson(path.resolve(__dirname, "package.json"));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webpackConfigJs = require("./webpack.renderer.config.js");
    Object.keys(webpackConfigJs["externals"]).forEach(pkg => (packageJson.dependencies[pkg] = originalPackageJson.dependencies[pkg]));
  }
  delete packageJson["scripts"];
  return packageJson;
};

const packageAfterPrune = async (_forgeConfig: ResolvedForgeConfig, buildPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const npmInstall = spawn("npm", ["install", "--omit=dev"], {
      cwd: buildPath,
      stdio: "ignore",
      shell: true,
    });
    npmInstall.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("process finished with error code " + code));
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
  makers: [new MakerSquirrel({}), new MakerZIP({}, ["darwin", "win32"]), new MakerRpm({}), new MakerDeb({})],
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
