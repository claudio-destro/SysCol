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

export type ParsedCommand = Array<string> & {0: string};

export const parseCommand = (cmd: string): ParsedCommand => {
  const m = /^\s*([a-z]{3}|@[a-z]+)\s*([, ].*)?$/i.exec(cmd);
  if (m?.length >= 1) return [m[1].toLowerCase(), ...parseArguments(m[2])];
  throw new SyntaxError(`Unrecognized command ${JSON.stringify(cmd)}`);
};
