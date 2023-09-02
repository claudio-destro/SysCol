import {TestScript} from "../TestScript";
import {Environment} from "../../environment/Environment";
import {TextFileWriter} from "../../environment/TextFileWriter";
import {TestScriptError} from "../TestScriptError";

const now = (): string => new Date().toISOString().replace(/[-:]|\.\d+/g, "");

const mungFileName = (name: string): string => {
  return name.replace(/\{\{([^}]+)}}/g, ($0, $1): string => {
    switch ($1) {
      case "now":
        return now();
      default:
        return $0;
    }
  });
};

const prefix = (prefix: string, maxLength = 5, fillString = " "): string => prefix.padStart(maxLength, fillString);

const instant = (microseconds: number): string => `[${(microseconds / 1000).toFixed(1)}ms]`;

export const openLogFile = async (parentScript: TestScript, logFile: string, env: Environment): Promise<TextFileWriter> => {
  let writer: TextFileWriter;
  try {
    logFile = await env.resolvePath(parentScript.filePath, logFile);
    writer = await env.createTextFileWriter(mungFileName(logFile));
  } catch (e) {
    throw new TestScriptError(e.message, "FileError");
  }

  const onCommand = (command: string) => writer.write(`${prefix("<<")} ${command}\r\n`);
  const onResponse = (response: string, elapsed: number) => writer.write(`${prefix(">>")} ${response} ${instant(elapsed)}\r\n`);
  const onTest = (response: string, passed: boolean, elapsed: number) => writer.write(`${prefix(passed ? "PASS" : "FAIL")} ${response} ${instant(elapsed)}\r\n`);
  const onMessage = (type: "error" | "info" | "log", message: string) => writer.write(`${prefix(type.toUpperCase())} ${(message ?? "").trim()}\r\n`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => onMessage("error", `${error} at line ${parentScript.lineNumber}\r\n`);

  parentScript.on("error", onError);
  parentScript.on("message", onMessage);
  parentScript.on("command", onCommand);
  parentScript.on("response", onResponse);
  parentScript.on("test", onTest);

  writer.onclose = (): void => {
    parentScript.off("error", onError);
    parentScript.off("message", onMessage);
    parentScript.off("command", onCommand);
    parentScript.off("response", onResponse);
    parentScript.off("test", onTest);
  };

  return writer;
};
