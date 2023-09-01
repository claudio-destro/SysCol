export interface WriteStream {
  readonly filePath: string | null;
  open(file: string): Promise<void>;
  write(chunk: string): Promise<string>;
  close(): Promise<void>;
}
