import {SerialPortOpenOptions} from "../script/SerialPortOpenOptions";
import {TextFileWriter} from "./TextFileWriter";
import {SerialPort} from "./SerialPort";

export interface Environment {
  readTextFile(base: string, file: string): Promise<string>;
  createTextFileWriter(base: string, file: string): Promise<TextFileWriter>;
  openSerialPort(file: string, options: SerialPortOpenOptions): Promise<SerialPort>;
}
