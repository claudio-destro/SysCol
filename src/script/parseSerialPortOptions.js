const SHORTCUT_TO_PARITY = {
  N: "none",
  E: "even",
  M: "mark",
  O: "odd",
  S: "space",
};

const parseSerialPortOptions = cfg => {
  const m = /(\d+)-([8765])-([NEMOS]|none|even|mark|odd|space)-([12])/i.exec(cfg);
  if (m) {
    const [, baudRate, dataBits, parity, stopBits] = m;
    return {
      baudRate: +baudRate,
      dataBits: +dataBits,
      parity: (SHORTCUT_TO_PARITY[parity] ?? parity).toLowerCase(),
      stopBit: +stopBits,
    };
  }
  throw new SyntaxError(`Unrecognized serial configuration ${JSON.stringify(cfg)}`);
};

module.exports = {
  parseSerialPortConfiguration: parseSerialPortOptions,
};
