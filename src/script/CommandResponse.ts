export type CommandResponse = {
  command: string;
  commandLine: string;
  argv: Record<string, string>;
};
