import {dirname, resolve} from "@tauri-apps/api/path";
import {readTextFile} from "@tauri-apps/api/fs";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {TextFileWriterImpl} from "./TextFileWriterImpl";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";

export class TauriEnvironment implements Environment {
  async readTextFile(base: string, file: string): Promise<string> {
    base = await dirname(base);
    file = await resolve(base, file);
    return readTextFile(file);
  }

  async createTextFileWriter(base: string, file: string): Promise<TextFileWriter> {
    base = await dirname(base);
    file = await resolve(base, file);
    return new TextFileWriterImpl(file);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async openSerialPort(file: string, options: SerialPortOpenOptions): Promise<SerialPort> {
    throw new Error("Not yet implemented");
  }
}
