import {env} from "node:process";
import {SerialPort, SerialPort as NodeSerialPort} from "serialport";
import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";
import {SerialPortMock} from "./SerialPortMock";

export const newNativeSerialPort = (path: string, options: SerialPortOpenOptions): SerialPort => {
  const Ctor = env["NODE_ENV"] === "test" || env["NODE_ENV"] === "development" ? SerialPortMock : NodeSerialPort;
  return new Ctor({
    ...options,
    autoOpen: false,
    path,
  }) as NodeSerialPort;
};
