import {parseSerialPortOpenOptions} from "./parseSerialPortOpenOptions";
import {TestScriptError} from "../TestScriptError";
import {Environment} from "../../environment/Environment";
import {SerialPort} from "../../environment/SerialPort";

export const openSerialPort = async (path: string, args: string, env: Environment): Promise<SerialPort> => {
  return env.openSerialPort(path, parseSerialPortOpenOptions(args)).catch(err => {
    throw new TestScriptError(err.message, "HardwareError", err);
  });
};
