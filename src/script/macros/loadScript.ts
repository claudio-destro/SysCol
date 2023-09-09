import {TestScript} from "../TestScript";
import {TestScriptError} from "../TestScriptError";
import {Environment} from "../../environment/Environment";
import {TestScriptImpl} from "../TestScriptImpl";

export const loadScript = async (parentScript: TestScript, scriptFile: string, env: Environment): Promise<TestScript> => {
  let text: string;
  try {
    scriptFile = await env.resolvePath(parentScript.filePath, scriptFile);
    text = await env.readTextFile(scriptFile);
  } catch (e) {
    throw new TestScriptError(e.message, "FileError", e);
  }
  const script: TestScript = new TestScriptImpl(scriptFile, text, env);
  script.signal = parentScript.signal;
  return script;
};
