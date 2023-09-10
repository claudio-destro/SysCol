import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";
import {CommandResponse} from "../../../script/CommandResponse";

describe("VER response parsing", () => {
  test("should parse response", () => {
    expect(parseCommandResponse("{SC,VER,FWSC:1.4 HWSC:1.2 HWRM:1.3}")).toMatchObject({
      command: "ver",
      argv: [
        {key: "FWSC", value: "1.4"},
        {key: "HWSC", value: "1.2"},
        {key: "HWRM", value: "1.3"},
      ],
      error: false,
    } satisfies Omit<CommandResponse, "commandLine">);
  });
});
