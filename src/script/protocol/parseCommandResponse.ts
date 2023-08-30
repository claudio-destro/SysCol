import {CommandResponse, CommandResponseArgument} from "../CommandResponse";
import {TestScriptError} from "../TestScriptError";

const parseArgument = (arg: string): CommandResponseArgument => {
  const m = /^\s*([^:]*)(?::([^ ]+))?\s*$/.exec(arg);
  if (m && m[1]) return {key: m[1], value: m[2]};
  throw new TestScriptError(`Unrecognized parameter ${JSON.stringify(arg)}`, "SYNTAX_ERROR");
};

const parseArguments = (args: string): Array<CommandResponseArgument> => {
  const values: Array<CommandResponseArgument> = [];
  // XXX Beware of commas and spaces in the following tricky regular expression
  for (const re = /\s*[, ]\s*([^:,]+(?::[^, ]+)?)/g; ; ) {
    const m = re.exec(args);
    if (!m) break;
    values.push(parseArgument(m[1]));
  }
  return values;
};

export const parseCommandResponse = (str: string): CommandResponse => {
  if (str) {
    const m = /\{SC,([A-Z]{3})([^}]*)}/.exec(str);
    if (m?.length >= 1) {
      const command = m[1].toLowerCase();
      const commandLine = m[2];
      const argv = parseArguments(commandLine);
      const error = argv.filter(arg => arg.key === "ERR").length >= 1;
      return {command, commandLine, argv, error};
    }
  }
  throw new TestScriptError(`Unrecognized response ${JSON.stringify(str)}`, "SYNTAX_ERROR");
};
