import {parseCommandResponse} from "../../script/parseCommandResponse";
import {parseSerialPortOpenOptions} from "../../script/parseSerialPortOpenOptions";

describe("parseSerialPortOpenOptions", () => {
  test('should not throw', () => expect(() => parseSerialPortOpenOptions("9600-8-N-1")).not.toThrow());
  test('should parse options', () => {
    const options = parseSerialPortOpenOptions("9600-8-N-1");
    expect(options.baudRate).toEqual(9600);
    expect(options.dataBits).toEqual(8);
    expect(options.parity).toEqual("none");
    expect(options.stopBit).toEqual(1);
  });
});
