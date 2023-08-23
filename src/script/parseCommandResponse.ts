const parseParameter = (param: string): Record<string, string> => {
  const m = /^\s*([^:]*)(?::([^ ]+))?\s*$/.exec(param);
  if (m && m[1]) return {[m[1]]: m[2]};
  throw new SyntaxError(`Unrecognized parameter ${JSON.stringify(param)}`);
};

const parseParameters = (params: string): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const re = /\s*[, ]\s*([^:,]+(?::[^, ]+)?)/g; ; ) {
    const m = re.exec(params);
    if (!m) break;
    Object.assign(map, parseParameter(m[1]));
  }
  return map;
};

export type ParsedCommandResponse = [string, Record<string, string>];

export const parseCommandResponse = (str: string): ParsedCommandResponse => {
  const m = /\{SC,([A-Z]{3})([^}]*)}/.exec(str);
  if (m?.length >= 1) return [m[1].toLowerCase(), parseParameters(m[2])];
  throw new SyntaxError(`Unrecognized response ${JSON.stringify(str)}`);
};

export const wasCommandMalformed = (params: Record<string, string>): boolean => "ERR" in params;
