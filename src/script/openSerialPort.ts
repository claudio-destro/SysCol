import {SerialPort} from "serialport";
import {parseSerialPortOpenOptions} from "./parseSerialPortOpenOptions";
import {env} from "node:process";
import {EchoSerialPortMock} from "./EchoSerialPortMock";

export const openSerialPort = async (path: string, args: string): Promise<SerialPort> => {
  const options = {
    ...parseSerialPortOpenOptions(args),
    autoOpen: false,
    path,
  };
  const mock = env["NODE_ENV"] === "development";
  const serialPort = mock ? new EchoSerialPortMock(options).asSerialPort() : new SerialPort(options);
  return new Promise((resolve, reject) => serialPort.open(err => (err ? reject(err) : resolve(serialPort))));
};
