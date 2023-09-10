import {parseCommand} from "../../../protocols/syscol/parseCommand";
import {stringifyHardwareCommand} from "../../../protocols/syscol/stringifyHardwareCommand";
import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";
import {CommandResponse} from "../../../script/CommandResponse";
import ProvidesCallback = jest.ProvidesCallback;

// prettier-ignore
const REGISTERS: Record<string, string> = {
  "7.3,D,R": "00015,00025,00025,00015,00023,00023,00015,00023,00023,00015,00033,00033,00015,00033,00033,00015,00032,00015,00015,00033,00033,00015,00033,00033,00015,00033,00033,00015,00033,00033,00015,00033,00033,00000,00000,00000,00000,00000,00000,00000,00000,00000,00015,00033,00033",
  "7.3,E": "00512,00313,00709,00512,00475,00547,00512,00475,00547,00512,00399,00625,00512,00399,00625,00000,00626,00000,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00000,00000,00000,00000,00000,00000,00000,00000,00000,00512,00148,00876",
  "7.3,E,R": "00512,00313,00709,00512,00475,00547,00512,00475,00547,00512,00399,00625,00512,00399,00625,00000,00626,00000,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00000,00000,00000,00000,00000,00000,00000,00000,00000,00512,00148,00876",
  "7.3,E,W": "00512,00313,00709,00512,00475,00547,00512,00475,00547,00512,00399,00625,00512,00399,00625,00000,00626,00000,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00000,00000,00000,00000,00000,00000,00000,00000,00000,00512,00148,00876",
  "7.3,G": "00000,00430,00430,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,00430,00000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,00000,00000,00000,00000,00000,00000,00000,00000,00000,07000,07000",
  "7.3,G,R": "00000,00430,00430,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,00430,00000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,00000,00000,00000,00000,00000,00000,00000,00000,00000,07000,07000",
  "8.5,G,R": "00000,00000,00000,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,07000,07000,00000,07000,07000,00000,07000,07000",
  "8.5,T,R": "00000,00000,00000,00000,00428,00522,00000,00428,00522,00000,00372,00428,00000,00372,00428,00000,00130,00167,00000,00130,00167,00000,00130,00167",
  "8.5,G,W": "00000,00000,00000,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,07000,07000,00000,07000,07000,00000,07000,07000",
  "a.0,R,R": "00000,00000,04950,09896,04950,09906,04950,09896,04950,09906,04950,09906,04950,09896,03999,11251,03999,11252,00000,00000,07998,05003,00000,00000,00000,00000",
  "a.0,E,R": "00000,00000,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,04000,11250,04000,11250,04000,11250,08000,05000,08000,05000,08000,05000",
  "a.0,D,R": "00000,00000,00100,00050,00100,00050,00100,0005000100,00050,00100,00050,00100,00050,00080,00030,00080,00030,00080,00030,00160,0050,00160,00050,00160,00050",
  "a.0,E,W": "00002,00055,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,04000,11250,04000,11250,04000,11250,08000,05000,08000,05000,08000,05000",
};

describe("PAR query parsing", () => {
  test("should parse query 7.3", () => expect(parseCommand("par 7.3 g ?")).toMatchObject({command: "par", argv: ["7.3", "g", "?"]}));
  test("should parse query 7.3", () => expect(parseCommand("par 7.3 e ?")).toMatchObject({command: "par", argv: ["7.3", "e", "?"]}));
  test("should parse query 8.5", () => expect(parseCommand("par 8.5 g ?")).toMatchObject({command: "par", argv: ["8.5", "g", "?"]}));
  test("should parse query 8.5", () => expect(parseCommand("par 8.5 t ?")).toMatchObject({command: "par", argv: ["8.5", "t", "?"]}));
  test("should parse query a.0", () => expect(parseCommand("par a.0 r ?")).toMatchObject({command: "par", argv: ["a.0", "r", "?"]}));
  test("should parse query a.0", () => expect(parseCommand("par a.0 e ?")).toMatchObject({command: "par", argv: ["a.0", "e", "?"]}));
  test("should parse query a.0", () => expect(parseCommand("par a.0 d ?")).toMatchObject({command: "par", argv: ["a.0", "d", "?"]}));
});

describe("PAR query stringification", () => {
  test("should stringify query 7.3", () => expect(stringifyHardwareCommand("par", "7.3", "g", "?")).toEqual("{sc,par,7.3,g,?}"));
  test("should stringify query 7.3", () => expect(stringifyHardwareCommand("par", "7.3", "e", "?")).toEqual("{sc,par,7.3,e,?}"));
  test("should stringify query 8.5", () => expect(stringifyHardwareCommand("par", "8.5", "g", "?")).toEqual("{sc,par,8.5,g,?}"));
  test("should stringify query 8.5", () => expect(stringifyHardwareCommand("par", "8.5", "t", "?")).toEqual("{sc,par,8.5,t,?}"));
  test("should stringify query a.0", () => expect(stringifyHardwareCommand("par", "a.0", "r", "?")).toEqual("{sc,par,a.0,r,?}"));
  test("should stringify query a.0", () => expect(stringifyHardwareCommand("par", "a.0", "e", "?")).toEqual("{sc,par,a.0,e,?}"));
  test("should stringify query a.0", () => expect(stringifyHardwareCommand("par", "a.0", "d", "?")).toEqual("{sc,par,a.0,d,?}"));
});

describe("PAR write parsing", () => {
  test("should write command a.0", () => {
    const params = REGISTERS["a.0,E,W"].split(",");
    expect(parseCommand(`par a.0 e w:${params.join(" ")}`)).toMatchObject({command: "par", argv: ["a.0", "e", "w:" + params[0], ...params.slice(1)]});
    expect(parseCommand(`par a.0 e w:${params.join(",")}`)).toMatchObject({command: "par", argv: ["a.0", "e", "w:" + params[0], ...params.slice(1)]});
  });
});

describe("PAR write stringification", () => {
  test("should stringify write a.0", () => {
    const params = REGISTERS["a.0,E,W"].split(",");
    expect(stringifyHardwareCommand("par", "a.0", "e", "w:" + params[0], ...params.slice(1))).toEqual(`{sc,par,a.0,e,w:${params.join(",")}}`);
  });
});

describe("PAR response parsing", () => {
  const makeTest = <K extends keyof typeof REGISTERS>(key: K): ProvidesCallback => {
    const params = REGISTERS[key].split(",");
    const [test, register, rw] = key.split(",");
    return () => {
      expect(parseCommandResponse(`{SC,PAR,${key}:${params.join(",")}}`)).toMatchObject({
        command: "par",
        argv: [{key: test}, {key: register}, {key: rw, value: params[0]}, ...params.slice(1).map(key => ({key, value: undefined}))],
        error: false,
      } satisfies Omit<CommandResponse, "commandLine">);
    };
  };
  test("should parse response 7.3,D,R", makeTest("7.3,D,R"));
  test("should parse response 7.3,E,R", makeTest("7.3,E,R"));
  test("should parse response 7.3,E,W", makeTest("7.3,E,W"));
  test("should parse response 7.3,G,R", makeTest("7.3,G,R"));
  test("should parse response 8.5,G,R", makeTest("8.5,G,R"));
  test("should parse response 8.5,T,R", makeTest("8.5,T,R"));
  test("should parse response 8.5,G,W", makeTest("8.5,G,W"));
  test("should parse response a.0,R,R", makeTest("a.0,R,R"));
  test("should parse response a.0,E,R", makeTest("a.0,E,R"));
  test("should parse response a.0,D,R", makeTest("a.0,D,R"));
  test("should parse response a.0,E,W", makeTest("a.0,E,W"));
});
