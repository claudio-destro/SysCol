import {SerialPort} from "serialport";
import {parseSerialPortOpenOptions} from "./parseSerialPortOpenOptions";

export const openSerialPort = async (path: string, args: string): Promise<SerialPort> => {
  const serialPort = new SerialPort({
    ...parseSerialPortOpenOptions(args),
    autoOpen: false,
    path,
  });
  return new Promise((resolve, reject) => serialPort.open(err => (err ? reject(err) : resolve(serialPort))));
};
