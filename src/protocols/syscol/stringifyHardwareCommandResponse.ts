export const stringifyHardwareCommandResponse = (cmd: string, ...args: Array<string>): string => `{${["SC", cmd.toUpperCase(), ...args].join()}}`;

export const stringifyTestCommandResponse = (testId: string, pass: boolean): string => stringifyHardwareCommandResponse("TST", `${testId}:${pass ? "PASS" : "FAIL"}`);
