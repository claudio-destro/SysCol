import {SerialPort} from "../SerialPort";
import {RegexParser, SerialPort as NativeSerialPort} from "serialport";

export const makeSerialPort = (port: NativeSerialPort): SerialPort => {
  const reader = port.pipe(new RegexParser({regex: /[\r\n]+/}));
  return {
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
};
