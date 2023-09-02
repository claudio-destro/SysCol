export interface TextFileWriter {
  readonly filePath: string;
  onclose: () => void | null;
  write(chunk: string): Promise<void>;
  close(): Promise<void>;
}
