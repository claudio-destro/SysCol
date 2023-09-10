import {TestScript} from "../TestScript";
import {TestScriptError} from "../TestScriptError";
import {Environment} from "../../environment/Environment";
import {TestScriptImpl} from "../TestScriptImpl";
import {CommandProtocol} from "../CommandProtocol";

export const loadScript = async (parentScript: TestScript, scriptFile: string, environment: Environment, protocol: CommandProtocol): Promise<TestScript> => {
  let text: string;
  try {
    scriptFile = await environment.resolvePath(parentScript.filePath, scriptFile);
    text = await environment.readTextFile(scriptFile);
  } catch (e) {
    throw new TestScriptError(e.message, "FileError", e);
  }
  const script: TestScript = new TestScriptImpl(scriptFile, text, environment, protocol);
  script.signal = parentScript.signal;
  return script;
};
