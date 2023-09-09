import {readFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {Environment} from "../Environment";
import {TextFileWriter} from "../TextFileWriter";
import {TextFileWriterImpl} from "./TextFileWriterImpl";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPort} from "../SerialPort";
import {newNativeSerialPort} from "./newNativeSerialPort";
import {makeSerialPort} from "./makeSerialPort";
import {areSerialPortOptionsEqual} from "./areSerialPortOptionsEqual";

export class ElectronEnvironment implements Environment {
  readonly #openPorts: {[ident: string]: {port: SerialPort; openOptions: SerialPortOpenOptions; openCount: number}} = {};

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

  openSerialPort(path: string, options: SerialPortOpenOptions): Promise<SerialPort> {
    if (this.#openPorts[path]) {
      if (areSerialPortOptionsEqual(this.#openPorts[path].openOptions, options)) {
        const openCount = ++this.#openPorts[path].openCount;
        console.log(`Serial port "${path}": use (${openCount})`);
        return Promise.resolve(this.#openPorts[path].port);
      }
      throw new RangeError(`Serial port "${path}" already open with different options`);
    }

    const port = newNativeSerialPort(path, options);
    const comm = makeSerialPort(port);
    return new Promise((resolve, reject) =>
      port.open(err => {
        if (err) return reject(err);
        this.#openPorts[path] = {port: comm, openOptions: {...options}, openCount: 1};
        console.log(`Serial port "${path}": open (1)`);

        const {close} = comm;
        comm.close = async (): Promise<void> => {
          const openCount = --this.#openPorts[path].openCount;
          console.log(`Serial port "${path}": close (${openCount})`);
          if (openCount <= 0) {
            return close.call(comm).finally(() => {
              console.log(`Serial port "${path}": closed (0)`);
              delete this.#openPorts[path];
            });
          }
        };

        resolve(comm);
      }),
    );
  }
}
