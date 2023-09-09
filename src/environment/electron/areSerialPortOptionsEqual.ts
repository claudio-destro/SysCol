import {SerialPortOpenOptions} from "../../script/SerialPortOpenOptions";

export const areSerialPortOptionsEqual = (current: SerialPortOpenOptions, wanted: SerialPortOpenOptions): boolean =>
  current === wanted || (current.baudRate === wanted.baudRate && current.parity === wanted.parity && current.dataBits === wanted.dataBits && current.stopBits === wanted.stopBits);
