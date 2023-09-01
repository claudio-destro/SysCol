import {readFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {RegexParser, SerialPort as NodeSerialPort} from "serialport";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {TextFileWriterImpl} from "./TextFileWriterImpl";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";

export class TauriEnvironment implements Environment {
  async readTextFile(base: string, file: string): Promise<string> {
    base = dirname(base);
    file = resolve(base, file);
    const data: Buffer = await readFile(file);
    return data.toString("utf8");
  }

  createTextFileWriter = async (base: string, file: string): Promise<TextFileWriter> => {
    base = dirname(base);
    file = resolve(base, file);
    return new TextFileWriterImpl(file);
  };

  async openSerialPort(path: string, options: SerialPortOpenOptions): Promise<SerialPort> {
    const port = new NodeSerialPort({
      ...options,
      autoOpen: false,
      path,
    });
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
