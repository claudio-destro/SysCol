import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";

describe("DUT response parsing", () => {
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,DUT,DREG[CA:00H,DE:00H]}")).toMatchObject({
      command: "dut",
      argv: [
        {
          key: "DREG",
          value: "CA:00H,DE:00H",
        },
      ],
    }));
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,DUT,DREG[CA:01H,DE:02H]}")).toMatchObject({
      command: "dut",
      argv: [
        {
          key: "DREG",
          value: "CA:01H,DE:02H",
        },
      ],
    }));
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,DUT,DREG[NOT FOUND]}")).toMatchObject({
      command: "dut",
      argv: [
        {
          key: "DREG",
          value: "NOT FOUND",
        },
      ],
    }));
});
