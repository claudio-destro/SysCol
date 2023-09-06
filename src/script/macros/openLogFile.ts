import {TestScript} from "../TestScript";
import {Environment} from "../../environment/Environment";
import {TextFileWriter} from "../../environment/TextFileWriter";
import {TestScriptError} from "../TestScriptError";
import {TestScriptListenerMap} from "../TestScriptEvents";
import {LogOutputType} from "../LogOutputType";
import {parseTestResponse} from "../protocol/parseCommandResponse";

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

const noop = () => {};

const mapTestToLabel = (response: string): string => parseTestResponse(response).label;

export const openLogFile = async (parentScript: TestScript, logFile: string, format: LogOutputType, env: Environment): Promise<TextFileWriter> => {
  let writer: TextFileWriter;
  try {
    logFile = await env.resolvePath(parentScript.filePath, logFile);
    writer = await env.createTextFileWriter(mungFileName(logFile));
  } catch (e) {
    throw new TestScriptError(e.message, "FileError");
  }

  const formats: Record<LogOutputType, TestScriptListenerMap> = {
    full: {
      command: (command: string) => writer.write(`${prefix("<<")} ${command}\r\n`),
      response: (response: string, elapsed: number) => writer.write(`${prefix(">>")} ${response} ${instant(elapsed)}\r\n`),
      test: (response: string, passed: boolean, elapsed: number) => writer.write(`${prefix(passed ? "PASS" : "FAIL")} ${response} ${instant(elapsed)}\r\n`),
      message: (type: "error" | "info" | "log", message: string) => writer.write(`${prefix(type.toUpperCase())} ${(message ?? "").trim()}\r\n`),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any) => writer.write(`${prefix("error")} ${error} at line ${parentScript.lineNumber}\r\n`),
      start: noop,
      stop: noop,
    },
    "tests-only": {
      command: noop,
      response: noop,
      test: (response: string, passed: boolean) => writer.write(`${passed ? "PASS" : "FAIL"} ${mapTestToLabel(response)}\r\n`),
      message: noop,
      error: noop,
      start: noop,
      stop: noop,
    },
  };

  const outputFormat = formats[format] ?? formats["tests-only"];

  parentScript.on("error", outputFormat.error);
  parentScript.on("message", outputFormat.message);
  parentScript.on("command", outputFormat.command);
  parentScript.on("response", outputFormat.response);
  parentScript.on("test", outputFormat.test);

  writer.onclose = (): void => {
    parentScript.off("error", outputFormat.error);
    parentScript.off("message", outputFormat.message);
    parentScript.off("command", outputFormat.command);
    parentScript.off("response", outputFormat.response);
    parentScript.off("test", outputFormat.test);
  };

  return writer;
};
