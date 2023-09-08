export interface SerialPort {
  close(): Promise<void>;
  read(timeout: number): Promise<string | null>;
  write(chunk: string): Promise<void>;
}
