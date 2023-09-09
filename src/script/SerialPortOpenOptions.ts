export type SerialPortDataBits = 5 | 6 | 7 | 8;
export type SerialPortParity = "none" | "even" | "mark" | "odd" | "space";
export type SerialPortStopBits = 1 | 2;

export type SerialPortOpenOptions = {
  baudRate: number;
  dataBits: SerialPortDataBits;
  parity: SerialPortParity;
  stopBits: SerialPortStopBits;
};
