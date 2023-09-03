import {dirname, resolve} from "@tauri-apps/api/path";
import {readTextFile} from "@tauri-apps/api/fs";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";
import {TextFileWriterImpl} from "./TextFileWriterImpl";

export class TauriEnvironment implements Environment {
  async resolvePath(base: string, file: string): Promise<string> {
    base = await dirname(base);
    return await resolve(base, file);
  }

  async readTextFile(file: string): Promise<string> {
    return readTextFile(file);
  }

  async createTextFileWriter(file: string): Promise<TextFileWriter> {
    throw new TextFileWriterImpl(file);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async openSerialPort(file: string, options: SerialPortOpenOptions): Promise<SerialPort> {
    throw new Error("Not yet implemented");
  }
}
