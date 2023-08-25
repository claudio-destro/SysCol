import {CommandResponse} from "../CommandResponse";

const parseArgument = (arg: string): Record<string, string> => {
  const m = /^\s*([^:]*)(?::([^ ]+))?\s*$/.exec(arg);
  if (m && m[1]) return {[m[1]]: m[2]}; // XXX Squash equal keys together
  throw new SyntaxError(`Unrecognized parameter ${JSON.stringify(arg)}`);
};

const parseArguments = (args: string): Record<string, string> => {
  const map: Record<string, string> = {};
  // XXX Beware of commas and spaces in the following tricky regular expression
  for (const re = /\s*[, ]\s*([^:,]+(?::[^, ]+)?)/g; ; ) {
    const m = re.exec(args);
    if (!m) break;
    Object.assign(map, parseArgument(m[1]));
  }
  return map;
};

export const parseCommandResponse = (str: string): CommandResponse => {
  if (str) {
    const m = /\{SC,([A-Z]{3})([^}]*)}/.exec(str);
    if (m?.length >= 1) {
      return {
        command: m[1].toLowerCase(),
        commandLine: m[2],
        argv: parseArguments(m[2]),
      };
    }
  }
  throw new SyntaxError(`Unrecognized response ${JSON.stringify(str)}`);
};

export const wasCommandMalformed = (params: Record<string, string>): boolean => "ERR" in params;
