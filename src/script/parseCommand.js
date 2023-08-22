const stringifyHardwareCommand = (cmd, ...args) => {
  if (args.length === 0) args.push("?");
  return `{${["sc", cmd.toLowerCase(), ...args].join()}}`;
};

const parseArguments = args => {
  const values = [];
  if (args) {
    for (const re = /\s*[, ]\s*([^, ]+)/g; ; ) {
      const m = re.exec(args);
      if (!m) break;
      values.push(m[1]);
    }
  }
  return values;
};

const parseCommand = cmd => {
  const m = /^\s*([a-z]{3}|@[a-z]+)\s*([, ].*)?$/i.exec(cmd);
  if (m?.length >= 1) return [m[1].toLowerCase(), ...parseArguments(m[2])];
  throw new SyntaxError(`Unrecognized command ${JSON.stringify(cmd)}`);
};

module.exports = {
  parseCommand,
  stringifyHardwareCommand,
};
