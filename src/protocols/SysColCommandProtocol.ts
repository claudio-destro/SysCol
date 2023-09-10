import {CommandProtocol} from "../script/CommandProtocol";
import {getTestResult, isTestFailed, isTestPassed} from "./syscol/getTestResult";
import {parseCommand} from "./syscol/parseCommand";
import {parseCommandResponse, parseTestResponse} from "./syscol/parseCommandResponse";
import {stringifyHardwareCommand} from "./syscol/stringifyHardwareCommand";

export class SysColCommandProtocol implements CommandProtocol {
  getTestResult = getTestResult;
  isTestFailed = isTestFailed;
  isTestPassed = isTestPassed;
  parseCommand = parseCommand;
  parseCommandResponse = parseCommandResponse;
  parseTestResponse = parseTestResponse;
  stringifyHardwareCommand = stringifyHardwareCommand;
}
