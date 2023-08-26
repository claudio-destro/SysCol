import {app} from "electron";
import {dirname, resolve} from "node:path";
import {createWriteStream} from "node:fs";
import {LogFile} from "../LogFile";
import {TestScript} from "../TestScript";
import {randomInt} from "crypto";

const now = (): string => new Date().toISOString().replace(/[-:]|\.\d+/g, "");
const rnd = (): string => "" + randomInt(0, 1_000_000);

const mungeFileName = (name: string): string => {
  return name.replace(/\{\{([^}]+)}}/g, ($0, $1): string => {
    switch ($1) {
      case "rnd":
        return rnd();
      case "now":
        return now();
      default:
        return $0;
    }
  });
};

const prefix = (prefix: string, maxLength = 5, fillString = " "): string => prefix.padStart(maxLength, fillString);

const instant = (microseconds: number): string => `[${(microseconds / 1000).toFixed(1)}ms]`;

export const openLogFile = async (script: TestScript, logFile: string): Promise<LogFile> => {
  const {filePath: basePath} = script;
  const basedir = typeof basePath === "string" || basePath instanceof Buffer ? dirname(basePath.toString()) : app.getPath("logs");
  const path = resolve(basedir, mungeFileName(logFile))
  const writer = createWriteStream(path);
  
  const onCommand = (command: string) => writer.write(`${prefix("<<")} ${command}\r\n`);
  const onResponse = (response: string, elapsed: number) => writer.write(`${prefix(">>")} ${response} ${instant(elapsed)}\r\n`);
  const onTest = (response: string, passed: boolean, elapsed: number) => writer.write(`${prefix(passed ? "PASS" : "FAIL")} ${response} ${instant(elapsed)}\r\n`);
  const onMessage = (type: "error" | "info" | "log", message: string) => writer.write(`${prefix(type.toUpperCase())} ${(message ?? "").trim()}\r\n`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => onMessage("error", `${error} at line ${script.lineNumber}\r\n`);

  script.on("error", onError);
  script.on("message", onMessage);
  script.on("command", onCommand);
  script.on("response", onResponse);
  script.on("test", onTest);

  const close = (): void => {
    writer.close();
    script.off("error", onError);
    script.off("message", onMessage);
    script.off("command", onCommand);
    script.off("response", onResponse);
    script.off("test", onTest);
  }

  return {
    path,
    write(message: string): void {
      writer.write(message);
    },
    close,
  };
};
