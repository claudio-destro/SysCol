import {SerialPortOpenOptions} from "../script/SerialPortOpenOptions";
import {TextFileWriter} from "./TextFileWriter";
import {SerialPort} from "./SerialPort";

export interface Environment {
  resolvePath(base: string, file: string): Promise<string>;
  readTextFile(file: string): Promise<string>;
  createTextFileWriter(file: string): Promise<TextFileWriter>;
  openSerialPort(file: string, options: SerialPortOpenOptions): Promise<SerialPort>;
}
