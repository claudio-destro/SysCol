import {CancelableResult} from "../CancelableResult";

export interface SerialPort {
  close(): Promise<void>;
  read(timeout: number): CancelableResult<string | null>;
  write(chunk: string): Promise<void>;
}
