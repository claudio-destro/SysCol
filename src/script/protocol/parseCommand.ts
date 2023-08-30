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

export const parseCommand = (str: string): Command => {
  if (str) {
    const m = /^\s*([a-z]{3}|@[a-z_]+)(\s*[, ].*)?$/i.exec(str);
    if (m?.length >= 1) {
      return {
        command: m[1].toLowerCase(),
        commandLine: m[2],
        argv: parseArguments(m[2]),
      };
    }
  }
  throw new TestScriptError(`Unrecognized command ${JSON.stringify(str)}`, "SYNTAX_ERROR");
};
