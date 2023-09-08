import {CommandResponse, CommandResponseArgument, TestResponse} from "../CommandResponse";
import {TestScriptError} from "../TestScriptError";
import {makeTestResponse} from "./makeTestResponse";

const parseArgument = (arg: string): CommandResponseArgument => {
  const m = /^\s*([^:]*)(?::([^ ]+))?\s*$/.exec(arg);
  if (m && m[1]) return {key: m[1], value: m[2]};
  throw new TestScriptError(`Unrecognized parameter ${JSON.stringify(arg)}`, "SyntaxError");
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

const parseALM = (args: string): Array<CommandResponseArgument> => {
  const m = /,?(IL\(P,T,C\)):([01],[01],[01]),(VL\(P,T,C\)):([01],[01],[01]),(VH\(P,T,C\)):([01],[01],[01])/.exec(args);
  return m?.length === 7
    ? [
        {key: m[1], value: m[2]},
        {key: m[3], value: m[4]},
        {key: m[5], value: m[6]},
      ]
    : parseArguments(args);
};

const parseDDI = (args: string): Array<CommandResponseArgument> => {
  const m = /,?(DIGI-IN)\[([^\]]+)]/.exec(args);
  return m?.length === 3 ? [{key: m[1], value: m[2]}] : parseArguments(args);
};

const parseDUT = (args: string): Array<CommandResponseArgument> => {
  const m = /,?(DREG)\[([^\]]+)]/.exec(args);
  return m?.length === 3 ? [{key: m[1], value: m[2]}] : parseArguments(args);
};

const CUSTOM_PARSERS: Record<string, (args: string) => Array<CommandResponseArgument>> = {
  alm: parseALM,
  ddi: parseDDI,
  dut: parseDUT,
};

export const parseCommandResponse = (str: string): CommandResponse => {
  if (str) {
    const m = /\{SC,([A-Z]{3})([^}]*)}/.exec(str);
    if (m?.length >= 1) {
      const command = m[1].toLowerCase();
      const commandLine = m[2];
      const parse = CUSTOM_PARSERS[command] ?? parseArguments;
      const argv = parse(commandLine);
      const error = argv.filter(arg => arg.key === "ERR").length >= 1;
      return {command, commandLine, argv, error};
    }
  }
  throw new TestScriptError(`Unrecognized response ${JSON.stringify(str)}`, "SyntaxError");
};

export const parseTestResponse = (str: string): TestResponse => {
  const response: CommandResponse = parseCommandResponse(str);
  if (response.command === "tst") return makeTestResponse(response);
  throw new TestScriptError(`Not a TST response ${JSON.stringify(str)}`, "SyntaxError");
};
