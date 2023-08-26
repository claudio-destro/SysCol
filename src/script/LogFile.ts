export type LogFile = {
  readonly path: string;
  write: (message: string) => void;
  close: () => void;
};
