import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";

describe("DDI response parsing", () => {
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,DDI,DIGI-IN[HI:8FH,LO:FFH]}")).toMatchObject({
      command: "ddi",
      argv: [
        {
          key: "DIGI-IN",
          value: "HI:8FH,LO:FFH",
        },
      ],
    }));
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,DDI,NO ANSWER}")).toMatchObject({
      command: "ddi",
      argv: [
        {
          key: "NO ANSWER",
        },
      ],
    }));
});
