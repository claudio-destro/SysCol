import {parseCommand} from "../../protocols/syscol/parseCommand";

describe("parse macros", () => {
  test('should parse double quoted " arguments', () =>
    expect(parseCommand(' @xxx "A B C \' xyz" def')).toMatchObject({
      command: "xxx",
      argv: ["A B C ' xyz", "def"],
      macro: true,
    }));
  test("should parse single quoted ' arguments", () =>
    expect(parseCommand(" @xxx xyz def 'A B C ' ")).toMatchObject({
      command: "xxx",
      argv: ["xyz", "def", "A B C "],
      macro: true,
    }));
  test("should parse backtick quoted ` arguments", () =>
    expect(parseCommand(" @xxx xyz def ` 'A B C \"` 'I J K'")).toMatchObject({
      command: "xxx",
      argv: ["xyz", "def", " 'A B C \"", "I J K"],
      macro: true,
    }));
  test("should parse @open_log_file macro", () =>
    expect(parseCommand('@open_log_file "FullTest-{{now}}.log" "test-only"')).toMatchObject({
      command: "open_log_file",
      argv: ["FullTest-{{now}}.log", "test-only"],
      macro: true,
    }));
  test("should parse @open_serial_port macro", () =>
    expect(parseCommand("@open_serial_port COM7 115200-8-N-1")).toMatchObject({
      command: "open_serial_port",
      argv: ["COM7", "115200-8-N-1"],
      macro: true,
    }));
  test("should parse @timeout macro", () =>
    expect(parseCommand("@timeout 9s")).toMatchObject({
      command: "timeout",
      argv: ["9s"],
      macro: true,
    }));
  test("should parse @close_serial_port macro", () =>
    expect(parseCommand("@close_serial_port")).toMatchObject({
      command: "close_serial_port",
      argv: [],
      macro: true,
    }));
});
