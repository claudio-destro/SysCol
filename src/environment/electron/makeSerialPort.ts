import {SerialPort} from "../SerialPort";
import {RegexParser, SerialPort as NativeSerialPort} from "serialport";
import {CancelableResult} from "../../CancelableResult";

export const makeSerialPort = (port: NativeSerialPort): SerialPort => {
  const reader = port.pipe(new RegexParser({regex: /[\r\n]+/}));
  return {
    async close(): Promise<void> {
      reader.destroy();
      port.close();
    },

    read(timeout: number): CancelableResult<string | null> {
      let onCancel: () => void;
      const promise = new Promise<string | null>((resolve, reject) => {
        const onData = (response: string | Buffer): void => {
          // eslint-disable-next-line no-use-before-define
          reader.off("error", onError);
          // eslint-disable-next-line no-use-before-define
          clearTimeout(timeoutId);
          resolve(response.toString());
        };

        const onError = (error: Error): void => {
          // eslint-disable-next-line no-use-before-define
          reader.off("data", onData);
          // eslint-disable-next-line no-use-before-define
          clearTimeout(timeoutId);
          reject(error);
        };

        onCancel = (): void => {
          reader.off("data", onData);
          reader.off("error", onError);
          resolve(null);
        };

        const timeoutId: NodeJS.Timeout = setTimeout(onCancel, timeout);

        reader.once("data", onData);
        reader.once("error", onError);
      });

      return {
        cancel: onCancel,
        promise,
      };
    },

    async write(chunk: string): Promise<void> {
      port.write(chunk);
      port.drain();
    },
  };
};
