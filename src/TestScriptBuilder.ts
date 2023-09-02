import {TestScript} from "./script/TestScript";
import {TestScriptImpl} from "./script/TestScriptImpl";
import {Environment} from "./environment/Environment";
import {TestScriptInterruptController} from "./script/TestScriptInterruptController";
import {TestScriptInterruptControllerImpl} from "./script/TestScriptInterruptControllerImpl";

export class TestScriptBuilder {
  readonly #environment: Environment;

  constructor(env: Environment) {
    this.#environment = env;
  }

  async loadTestScript(path: string): Promise<TestScript> {
    const text: string = await this.#environment.readTextFile(path);
    return new TestScriptImpl(path, text, this.#environment);
  }

  async attachInterruptController(script: TestScript): Promise<TestScriptInterruptController> {
    const controller: TestScriptInterruptController = new TestScriptInterruptControllerImpl();
    script.signal = controller.signal;
    return controller;
  }
}
