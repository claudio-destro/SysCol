import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";

describe("parseCommandResponse", () => {
  test("should parse response", () => expect(parseCommandResponse("{SC,CAR,0FH}")).toMatchObject({command: "car", argv: [{key: "0FH"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DEV,05H}")).toMatchObject({command: "dev", argv: [{key: "05H"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DDO,RLY6:1}")).toMatchObject({command: "ddo", argv: [{key: "RLY6", value: "1"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DDO,NO ANSWER}")).toMatchObject({command: "ddo", argv: [{key: "NO ANSWER"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DDO,RLY4:0}")).toMatchObject({command: "ddo", argv: [{key: "RLY4", value: "0"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAI,ADC-IN0:01BDH]}")).toMatchObject({command: "dai", argv: [{key: "ADC-IN0", value: "01BDH]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAI,ADC-IN14:0000H]}")).toMatchObject({command: "dai", argv: [{key: "ADC-IN14", value: "0000H]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAO,DAC1:01BDH]}")).toMatchObject({command: "dao", argv: [{key: "DAC1", value: "01BDH]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAO,DAC5:0000H]}")).toMatchObject({command: "dao", argv: [{key: "DAC5", value: "0000H]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DVI,VINT1:01BDH]}")).toMatchObject({command: "dvi", argv: [{key: "VINT1", value: "01BDH]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DVI,VINT4:0000H]}")).toMatchObject({command: "dvi", argv: [{key: "VINT4", value: "0000H]"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAG,ALARM-GU0:1}")).toMatchObject({command: "dag", argv: [{key: "ALARM-GU0", value: "1"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DAG,ALARM-GU2:0}")).toMatchObject({command: "dag", argv: [{key: "ALARM-GU2", value: "0"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DMG,1}")).toMatchObject({command: "dmg", argv: [{key: "1"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DMG,0}")).toMatchObject({command: "dmg", argv: [{key: "0"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DMV,MVB-GUH:1}")).toMatchObject({command: "dmv", argv: [{key: "MVB-GUH", value: "1"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,IGL,2000.0mA}")).toMatchObject({command: "igl", argv: [{key: "2000.0mA"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,VGL,24.000v}")).toMatchObject({command: "vgl", argv: [{key: "24.000v"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,VGL,2.000v}")).toMatchObject({command: "vgl", argv: [{key: "2.000v"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,VGL,2.000V}")).toMatchObject({command: "vgl", argv: [{key: "2.000V"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,VGH,200.00V}")).toMatchObject({command: "vgh", argv: [{key: "200.00V"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,RST,DONE}")).toMatchObject({command: "rst", argv: [{key: "DONE"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,RST,NONE}")).toMatchObject({command: "rst", argv: [{key: "NONE"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,RST,?,ERR}").error).toBeTruthy());
  test("should parse response", () => expect(parseCommandResponse("{SC,DGI,A,FAAAH}")).toMatchObject({command: "dgi", argv: [{key: "A"}, {key: "FAAAH"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DGI,A,0000FFFFH}")).toMatchObject({command: "dgi", argv: [{key: "A"}, {key: "0000FFFFH"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,DGI,2,1}")).toMatchObject({command: "dgi", argv: [{key: "2"}, {key: "1"}]}));
  test("should parse response", () => expect(parseCommandResponse("{SC,VIN,1.53V}")).toMatchObject({command: "vin", argv: [{key: "1.53V"}]}));
});
