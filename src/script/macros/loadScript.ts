import {TestScript} from "../TestScript";
import {TestScriptError} from "../TestScriptError";
import {TestScriptImpl} from "../TestScriptImpl";
import {MacroArguments} from "../MacroArguments";
import {TestScriptCounters} from "../TestScriptCounters";

export type LoadScriptArguments = MacroArguments & {scriptFile: string; counters: TestScriptCounters};

export const loadScript = async ({parentScript, scriptFile, environment, protocol, counters}: LoadScriptArguments): Promise<TestScript> => {
  let text: string;
  try {
    scriptFile = await environment.resolvePath(parentScript.filePath, scriptFile);
    text = await environment.readTextFile(scriptFile);
  } catch (e) {
    throw new TestScriptError(e.message, "FileError", e);
  }
  const script: TestScript = new TestScriptImpl(scriptFile, text, environment, protocol, counters);
  script.confirm = parentScript.confirm;
  script.signal = parentScript.signal;
  return script;
};
