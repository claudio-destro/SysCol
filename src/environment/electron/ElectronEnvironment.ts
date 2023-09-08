import {readFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {TextFileWriterImpl} from "./TextFileWriterImpl";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";
import {newNativeSerialPort} from "./newNativeSerialPort";
import {makeSerialPort} from "./makeSerialPort";

export class ElectronEnvironment implements Environment {
  async resolvePath(base: string, file: string): Promise<string> {
    return resolve(dirname(base), file);
  }

  async readTextFile(file: string): Promise<string> {
    const data: Buffer = await readFile(file);
    return data.toString("utf8");
  }

  createTextFileWriter = async (file: string): Promise<TextFileWriter> => {
    return new TextFileWriterImpl(file);
  };

  async openSerialPort(path: string, options: SerialPortOpenOptions): Promise<SerialPort> {
    const port = newNativeSerialPort(path, options);
    const comm = makeSerialPort(port);
    return new Promise((resolve, reject) => port.open(err => (err ? reject(err) : resolve(comm))));
  }
}
