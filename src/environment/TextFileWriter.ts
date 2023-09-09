export type TextFileWriterEvents = {
  close: () => void;
};

export interface TextFileWriter {
  readonly filePath: string;
  on<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void;
  once<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void;
  off<T extends keyof TextFileWriterEvents>(event: T, listener?: TextFileWriterEvents[T]): void;
  write(chunk: string): Promise<void>;
  close(): Promise<void>;
}
