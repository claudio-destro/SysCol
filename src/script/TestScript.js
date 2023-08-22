const {readFile} = require("fs");
const {ReadlineParser} = require("serialport");
const {openSerialPort} = require("./openSerialPort");
const {stringifyHardwareCommand, parseCommand} = require("./parseCommand");
const {parseResponse, getTestOutcome} = require("./parseResponse");
const {sleep} = require("./sleep");

/* eslint default-case: "off" */
/* eslint no-await-in-loop: "off" */

/* eslint no-continue: "off" */

const padNumber = (num, pad = 5, fill = "0") => String(num).padStart(pad, fill);

class TestScript {
  #data;

  #currentLine = 0;

  #commandTimeout = 5000;

  #serialPort;

  #serialPortReader;

  constructor(data) {
    this.#data = data.toString().split(/\r\n|\r|\n/gm);
  }

  static async fromFile(path) {
    return new Promise((resolve, reject) => {
      readFile(path, (err, data) => (err ? reject(err) : resolve(new TestScript(data))));
    });
  }

  static async from(data) {
    return new TestScript(data);
  }

  onScriptError(err, lineno) {
    console.error("Error at line", lineno, err);
  }

  onLogMessage(str) {
    console.log("===============", str);
  }

  onLogCommand(cmd, lineno) {
    console.log(padNumber(lineno), "       <<", cmd.trim());
  }

  onCommandError(cmd, lineno) {
    console.error(padNumber(lineno), " ERROR >>", cmd.trim());
  }

  onCommandResponse(str, elapsed, lineno) {
    console.log(padNumber(lineno), "       >>", str.trim(), `in ${elapsed}ms`);
  }

  onTestPassed(cmd, elapsed, lineno) {
    console.info(padNumber(lineno), "  PASS >>", cmd.trim(), `in ${elapsed}ms`);
  }

  onTestFailed(cmd, elapsed, lineno) {
    console.warn(padNumber(lineno), "  FAIL >>", cmd.trim(), `in ${elapsed}ms`);
  }

  async executeScript() {
    try {
      for await (const ret of this.#executeCommand()) {
        const {response, elapsed} = ret;
        const [cmd, params] = parseResponse(response);
        if ("ERR" in params) {
          this.onCommandError(response, this.#currentLine);
          continue;
        }
        if (cmd === "tst") {
          switch (getTestOutcome(params).status) {
            case "FAIL":
              this.onTestFailed(response, elapsed, this.#currentLine);
              continue;
            case "PASS":
              this.onTestPassed(response, elapsed, this.#currentLine);
              continue;
          }
          // fallthrough
        }
        this.onCommandResponse(response, elapsed, this.#currentLine);
      }
    } catch (err) {
      this.onScriptError(err, this.#currentLine);
    } finally {
      this.#currentLine = 0;
    }
  }

  #nextLine() {
    if (this.#currentLine < this.#data.length) {
      const row = this.#data[this.#currentLine++];
      const m = /^([^#]*)/.exec(row);
      return m && m[1].trim() ? m[1] : this.#nextLine();
    }
    return null;
  }

  async *#executeCommand() {
    for (;;) {
      const row = this.#nextLine();
      if (row === null) return;
      const [cmd, ...args] = parseCommand(row);
      if (cmd.match(/^@/)) {
        this.onLogMessage(row);
        switch (cmd.substring(1)) {
          case "close":
            this.#serialPort?.close();
            this.#serialPort = null;
            break;
          case "open":
            this.#serialPort?.close();
            this.#serialPort = await openSerialPort(args[0], args[1]);
            this.#serialPortReader = this.#serialPort.pipe(new ReadlineParser());
            break;
          case "timeout":
            this.#commandTimeout = Math.max(500, +args[0]);
            break;
          case "wait":
            await sleep(args[0]);
            break;
          default:
            throw new SyntaxError(`Unrecognized command ${JSON.stringify(cmd)}`);
        }
      } else {
        yield this.#sendAndWait(stringifyHardwareCommand(cmd, ...args));
      }
    }
  }

  async #sendAndWait(cmd, timeout = this.#commandTimeout) {
    this.onLogCommand(cmd, this.#currentLine);
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const onData = response => {
        // eslint-disable-next-line no-use-before-define
        clearTimeout(id);
        resolve({
          response,
          elapsed: Date.now() - startTime,
        });
      };

      const id = setTimeout(() => {
        this.#serialPortReader.off("data", onData);
        reject(new RangeError(`"${cmd}" timed out after ${this.#commandTimeout}ms`));
      }, timeout);

      this.#serialPortReader.once("data", onData);

      this.#serialPort.write(cmd, err => {
        this.#serialPortReader.off("data", onData);
        clearTimeout(id);
        reject(err);
      });
    });
  }
}

module.exports = {
  TestScript,
};
