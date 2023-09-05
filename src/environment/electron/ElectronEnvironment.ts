import {readFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {RegexParser} from "serialport";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {TextFileWriterImpl} from "./TextFileWriterImpl";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";
import {newSerialPort} from "./newSerialPort";

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
    const port = newSerialPort(path, options);
    const reader = port.pipe(new RegexParser({regex: /[\r\n]+/}));
    const comm: SerialPort = {
      async close(): Promise<void> {
        reader.destroy();
        port.close();
      },
      async read(timeout: number): Promise<string | null> {
        return new Promise((resolve, reject) => {
          const onData = (response: string | Buffer): void => {
            // eslint-disable-next-line no-use-before-define
            reader.off("error", onError);
            // eslint-disable-next-line no-use-before-define
            clearTimeout(id);
            resolve(response.toString());
          };

          const onError = (error: Error): void => {
            // eslint-disable-next-line no-use-before-define
            reader.off("data", onData);
            // eslint-disable-next-line no-use-before-define
            clearTimeout(id);
            reject(error);
          };

          const id = setTimeout(() => {
            reader.off("data", onData);
            reader.off("error", onError);
            resolve(null);
          }, timeout);

          reader.once("data", onData);
          reader.once("error", onError);
        });
      },
      async write(chunk: string): Promise<void> {
        port.write(chunk);
        port.drain();
      },
    };
    return new Promise((resolve, reject) => port.open(err => (err ? reject(err) : resolve(comm))));
  }
}
