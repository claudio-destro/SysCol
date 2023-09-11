import {parseSerialPortOpenOptions} from "./parseSerialPortOpenOptions";
import {TestScriptError} from "../TestScriptError";
import {SerialPort} from "../../environment/SerialPort";
import {MacroArguments} from "../MacroArguments";

export type OpenSerialPortArguments = MacroArguments & {path: string; args: string};

export const openSerialPort = async ({path, args, environment}: OpenSerialPortArguments): Promise<SerialPort> => {
  return environment.openSerialPort(path, parseSerialPortOpenOptions(args)).catch(err => {
    throw new TestScriptError(err.message, "HardwareError", err);
  });
};
