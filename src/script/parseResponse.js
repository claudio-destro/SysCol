const parseParameter = param => {
  const m = /^\s*([^:]+)(?::([^ ]+))?\s*$/.exec(param);
  if (m && m[1]) return {[m[1]]: m[2]};
  throw new SyntaxError(`Unrecognized parameter ${JSON.stringify(param)}`);
};

const parseParameters = params => {
  const map = {};
  for (const re = /\s*[, ]\s*([^, ]+)/g; ; ) {
    const m = re.exec(params);
    if (!m) break;
    Object.assign(map, parseParameter(m[1]));
  }
  return map;
};

const parseResponse = str => {
  const m = /\{SC,([A-Z]{3})([^}]*)}/.exec(str);
  if (m?.length >= 1) return [m[1].toLowerCase(), parseParameters(m[2])];
  throw new SyntaxError(`Unrecognized response ${JSON.stringify(str)}`);
};

const getTestOutcome = params => {
  const outcome = Object.entries(params).filter(([, status]) => status.match(/FAIL|PASS/))[0] ?? [];
  return {test: outcome[0], status: outcome[1]};
};

const isTestFailed = params => getTestOutcome(params).status === "FAIL";

const isTestPassed = params => getTestOutcome(params).status === "PASS";

module.exports = {
  getTestOutcome,
  parseResponse,
  isTestFailed,
  isTestPassed,
};
