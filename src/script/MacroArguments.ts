import {Environment} from "../environment/Environment";
import {CommandProtocol} from "./CommandProtocol";
import {TestScript} from "./TestScript";

export type MacroArguments = {
  environment: Environment;
  parentScript: TestScript;
  protocol: CommandProtocol;
};
