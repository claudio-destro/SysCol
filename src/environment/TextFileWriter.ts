export interface TextFileWriter {
  readonly filePath: string | null;
  open(file: string): Promise<void>;
  write(chunk: string): Promise<void>;
  close(): Promise<void>;
}
