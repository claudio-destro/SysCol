const TO_MILLISECONDS: Record<string, number> = {
  us: 0.001,
  μs: 0.001,
  "": 1, // default
  ms: 1,
  s: 1_000,
  m: 60_000,
};

export const parseInterval = (str: string): number => {
  const m = /\s*(\d+(?:\.\d+)?)(\S*)/.exec(str);
  if (m) {
    const interval = +m[1];
    const mul = TO_MILLISECONDS[m[2]] ?? -1;
    if (mul > 0) return interval * mul;
    throw new RangeError(`Malformed interval ${JSON.stringify(str)}`);
  }
};
