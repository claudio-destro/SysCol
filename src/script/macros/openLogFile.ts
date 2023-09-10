import {TestScript} from "../TestScript";
import {Environment} from "../../environment/Environment";
import {TextFileWriter} from "../../environment/TextFileWriter";
import {TestScriptError} from "../TestScriptError";
import {TestScriptListenerMap} from "../TestScriptEvents";
import {LogOutputType} from "../LogOutputType";
import {CommandProtocol} from "../CommandProtocol";

const FILE_NAME_PLACEHOLDERS: Record<string, () => string> = {
  now: (): string => new Date().toISOString().replace(/[-:]|\.\d+/g, ""),
};

const mungFileName = (name: string): string => {
  return name.replace(/\{\{([^}]+)}}/g, ($0, $1): string => FILE_NAME_PLACEHOLDERS[$1]?.() ?? $0);
};

const prefix = (prefix: string, maxLength = 5, fillString = " "): string => prefix.padStart(maxLength, fillString);

const instant = (microseconds: number): string => `[${(microseconds / 1000).toFixed(1)}ms]`;

const noop = () => {
  /* EMPTY */
};

const EOL = "\r\n";

export const openLogFile = async (
  parentScript: TestScript,
  logFile: string,
  format: LogOutputType,
  environment: Environment,
  protocol: CommandProtocol,
): Promise<TextFileWriter> => {
  let writer: TextFileWriter;
  try {
    logFile = await environment.resolvePath(parentScript.filePath, logFile);
    logFile = mungFileName(logFile);
    console.log(`Open log file ${JSON.stringify(logFile)} - ${JSON.stringify(format)}`);
    writer = await environment.createTextFileWriter(logFile);
  } catch (e) {
    throw new TestScriptError(e.message, "FileError", e);
  }

  const mapTestToLabel = (response: string): string => protocol.parseTestResponse(response).label;

  const writeln = (str: string): void => {
    writer.write(`${str}${EOL}`).catch(console.error);
  };

  const formats: Record<LogOutputType, TestScriptListenerMap> = {
    full: {
      command: (command: string) => writeln(`${prefix("<<")} ${command}`),
      response: (response: string, elapsed: number) => writeln(`${prefix(">>")} ${response} ${instant(elapsed)}`),
      test: (response: string, passed: boolean, elapsed: number) => writeln(`${prefix(passed ? "PASS" : "FAIL")} ${response} ${instant(elapsed)}`),
      message: (type: "error" | "info" | "log", message: string) => writeln(`${prefix(type.toUpperCase())} ${(message ?? "").trim()}`),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any) => writeln(`${prefix("error")} ${error}`),
      start: noop,
      stop: noop,
    },
    "tests-only": {
      command: noop,
      response: noop,
      test: (response: string, passed: boolean): void => writeln(`# ${mapTestToLabel(response)} ${passed ? "PASS" : "FAIL"}${EOL}${response}`),
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

  writer.once("close", (): void => {
    parentScript.off("error", outputFormat.error);
    parentScript.off("message", outputFormat.message);
    parentScript.off("command", outputFormat.command);
    parentScript.off("response", outputFormat.response);
    parentScript.off("test", outputFormat.test);
    console.log(`Close log file ${logFile}`);
  });

  return writer;
};
