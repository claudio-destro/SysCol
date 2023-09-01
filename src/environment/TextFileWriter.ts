export interface TextFileWriter {
  readonly filePath: string;
  write(chunk: string): Promise<void>;
  close(): Promise<void>;
}
