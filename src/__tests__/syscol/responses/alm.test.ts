import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";

describe("ALM response parsing", () => {
  test("should parse response", () =>
    expect(parseCommandResponse("{SC,ALM,IL(P,T,C):0,0,1,VL(P,T,C):0,1,0,VH(P,T,C):0,0,1}")).toMatchObject({
      command: "alm",
      argv: [
        {key: "IL(P,T,C)", value: "0,0,1"},
        {key: "VL(P,T,C)", value: "0,1,0"},
        {key: "VH(P,T,C)", value: "0,0,1"},
      ],
    }));
});
