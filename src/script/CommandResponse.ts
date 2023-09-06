export type CommandResponseArgument = {key: string; value?: string | null};

export type CommandResponse = {
  command: string;
  commandLine: string;
  argv: Array<CommandResponseArgument>;
  error: boolean;
};

export type TestResponse = CommandResponse & {
  label: string;
};
