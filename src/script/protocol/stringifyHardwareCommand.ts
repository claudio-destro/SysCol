export const stringifyHardwareCommand = (cmd: string, ...args: Array<string>): string => {
  if (args.length === 0) args.push("?");
  return `{${["sc", cmd.toLowerCase(), ...args].join()}}`;
};
