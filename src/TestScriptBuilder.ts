import {TestScript} from "./script/TestScript";
import {TestScriptImpl} from "./script/TestScriptImpl";
import {Environment} from "./environment/Environment";
import {TestScriptInterruptController} from "./script/TestScriptInterruptController";
import {TestScriptInterruptControllerImpl} from "./script/TestScriptInterruptControllerImpl";
import {CommandProtocol} from "./script/CommandProtocol";

export class TestScriptBuilder {
  readonly #environment: Environment;
  readonly #protocol: CommandProtocol;

  constructor(environment: Environment, protocol: CommandProtocol) {
    this.#environment = environment;
    this.#protocol = protocol;
  }

  async loadTestScript(path: string): Promise<TestScript> {
    const text: string = await this.#environment.readTextFile(path);
    return new TestScriptImpl(path, text, this.#environment, this.#protocol);
  }

  async attachInterruptController(script: TestScript): Promise<TestScriptInterruptController> {
    const controller: TestScriptInterruptController = new TestScriptInterruptControllerImpl();
    script.signal = controller.signal;
    return controller;
  }
}
