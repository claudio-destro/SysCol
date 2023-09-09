import {Command} from "../Command";
import {TestScriptError} from "../TestScriptError";

const parseArguments = (args: string): Array<string> => {
  const values: Array<string> = [];
  if (args) {
    for (const re = /\s*[, ]\s*([^, ]+)/g; ; ) {
      const m = re.exec(args);
      if (!m) break;
      values.push(m[1]);
    }
  }
  return values;
};

const parseStrings = (args: string): Array<string> => {
  const values: Array<string> = [];
  if (args) {
    for (const re = /(["'`])(.*?)\1|[^, ]+/gm; ; ) {
      const m = re.exec(args);
      if (!m) break;
      values.push(m[2] ?? m[0]);
    }
  }
  return values;
};

export const parseCommand = (str: string, macroPrefix: string = "@"): Command => {
  if (str) {
    const parser = new RegExp(`^\\s*([a-z]{3}|${macroPrefix}[a-z_]+)(\\s*[, ].*)?$`, "i");
    const m = parser.exec(str);
    if (m?.length >= 1) {
      const command = m[1].toLowerCase();
      const macro = command.startsWith(macroPrefix);
      return {
        command: macro ? command.substring(macroPrefix.length) : command,
        commandLine: m[2],
        argv: macro ? parseStrings(m[2]) : parseArguments(m[2]),
        macro,
      };
    }
  }
  throw new TestScriptError(`Unrecognized command ${JSON.stringify(str)}`, "SyntaxError");
};
