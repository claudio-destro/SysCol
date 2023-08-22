type SerialPortDataBits = 5 | 6 | 7 | 8;
type SerialPortParity = "none" | "even" | "mark" | "odd" | "space";
type SerialPortStopBits = 1 | 2;

export type SerialPortOpenOptions = {
  baudRate: number;
  dataBits: SerialPortDataBits;
  parity: SerialPortParity;
  stopBit: SerialPortStopBits;
};

// prettier-ignore
type SerialPortParityShort<parity extends SerialPortParity> =
  parity extends "none" ? "N" :
  parity extends "even" ? "E" :
  parity extends "mark" ? "M" :
  parity extends "odd" ? "O" :
  parity extends "space" ? "S" :
  never;

const SHORTCUT_TO_PARITY: Record<SerialPortParityShort<SerialPortParity>, SerialPortParity> = {
  N: "none",
  E: "even",
  M: "mark",
  O: "odd",
  S: "space",
};

export const parseSerialPortOpenOptions = (cfg: string): SerialPortOpenOptions => {
  const m = /(\d+)-([5678])-([NEMOS]|none|even|mark|odd|space)-([12])/.exec(cfg);
  if (m) {
    const [, baudRate, dataBits, parity, stopBits] = m;
    return {
      baudRate: +baudRate,
      dataBits: +dataBits as SerialPortDataBits,
      parity: SHORTCUT_TO_PARITY[parity as SerialPortParityShort<SerialPortParity>] ?? (parity as SerialPortParity),
      stopBit: +stopBits as SerialPortStopBits,
    };
  }
  throw new SyntaxError(`Unrecognized serial configuration ${JSON.stringify(cfg)}`);
};
