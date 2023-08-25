import {parseCommand} from "../../script/protocol/parseCommand";

describe("parseCommand", () => {
  test('should parse "ver"', () => expect(parseCommand(" ver ?")).toMatchObject({command: "ver", argv: ["?"]}));
  test('should parse "ver"', () => expect(parseCommand(" ver x")).toMatchObject({command: "ver", argv: ["x"]}));
  test('should parse "car"', () => expect(parseCommand("car,0fh")).toMatchObject({command: "car", argv: ["0fh"]}));
  test('should parse "car"', () => expect(parseCommand("car,?")).toMatchObject({command: "car", argv: ["?"]}));
  test('should parse "dev"', () => expect(parseCommand("dev,05h")).toMatchObject({command: "dev", argv: ["05h"]}));
  test('should parse "dev"', () => expect(parseCommand("dev,?")).toMatchObject({command: "dev", argv: ["?"]}));
  test('should parse "dut"', () => expect(parseCommand("dut,?")).toMatchObject({command: "dut", argv: ["?"]}));
  test('should parse "dut"', () => expect(parseCommand("dut,c")).toMatchObject({command: "dut", argv: ["c"]}));
  test('should parse "dut"', () => expect(parseCommand("dut,s")).toMatchObject({command: "dut", argv: ["s"]}));
  test('should parse "ddi"', () => expect(parseCommand("ddi,l")).toMatchObject({command: "ddi", argv: ["l"]}));
  test('should parse "ddi"', () => expect(parseCommand("ddi,h")).toMatchObject({command: "ddi", argv: ["h"]}));
  test('should parse "ddi"', () => expect(parseCommand("ddi,?")).toMatchObject({command: "ddi", argv: ["?"]}));
  test('should parse "ddo"', () => expect(parseCommand("ddo,6,1")).toMatchObject({command: "ddo", argv: ["6", "1"]}));
  test('should parse "ddo"', () => expect(parseCommand("ddo,4,?")).toMatchObject({command: "ddo", argv: ["4", "?"]}));
  test('should parse "dai"', () => expect(parseCommand("dai,00,c")).toMatchObject({command: "dai", argv: ["00", "c"]}));
  test('should parse "dai"', () => expect(parseCommand("dai,14 ?")).toMatchObject({command: "dai", argv: ["14", "?"]}));
  test('should parse "dao"', () => expect(parseCommand("dao,1,01bdh")).toMatchObject({command: "dao", argv: ["1", "01bdh"]}));
  test('should parse "dao"', () => expect(parseCommand("dao,5,?")).toMatchObject({command: "dao", argv: ["5", "?"]}));
  test('should parse "dvi"', () => expect(parseCommand("dvi,1,c")).toMatchObject({command: "dvi", argv: ["1", "c"]}));
  test('should parse "dvi"', () => expect(parseCommand("dvi,4,?")).toMatchObject({command: "dvi", argv: ["4", "?"]}));
  test('should parse "dag"', () => expect(parseCommand("dag,0,c")).toMatchObject({command: "dag", argv: ["0", "c"]}));
  test('should parse "dag"', () => expect(parseCommand("dag,2,?")).toMatchObject({command: "dag", argv: ["2", "?"]}));
  test('should parse "dmg"', () => expect(parseCommand("dmg,1")).toMatchObject({command: "dmg", argv: ["1"]}));
  test('should parse "dmg"', () => expect(parseCommand("dmg,?")).toMatchObject({command: "dmg", argv: ["?"]}));
  test('should parse "igl"', () => expect(parseCommand("igl,2000.0ma")).toMatchObject({command: "igl", argv: ["2000.0ma"]}));
  test('should parse "igl"', () => expect(parseCommand("igl,?")).toMatchObject({command: "igl", argv: ["?"]}));
  test('should parse "alm"', () => expect(parseCommand("alm,?")).toMatchObject({command: "alm", argv: ["?"]}));
  test('should parse "alm"', () => expect(parseCommand("alm,igl,?")).toMatchObject({command: "alm", argv: ["igl", "?"]}));
  test('should parse "alm"', () => expect(parseCommand("alm,vgl,?")).toMatchObject({command: "alm", argv: ["vgl", "?"]}));
  test('should parse "alm"', () => expect(parseCommand("alm,vgh,?")).toMatchObject({command: "alm", argv: ["vgh", "?"]}));
  test('should parse "vgl"', () => expect(parseCommand(" vgl, 24.000v")).toMatchObject({command: "vgl", argv: ["24.000v"]}));
  test('should parse "vgl"', () => expect(parseCommand(" vgl, 2.000v")).toMatchObject({command: "vgl", argv: ["2.000v"]}));
  test('should parse "vgl"', () => expect(parseCommand(" vgl, 2.1v")).toMatchObject({command: "vgl", argv: ["2.1v"]}));
  test('should parse "vgl"', () => expect(parseCommand(" vgl, ?")).toMatchObject({command: "vgl", argv: ["?"]}));
  test('should parse "vgh"', () => expect(parseCommand(" vgh, 200.0v")).toMatchObject({command: "vgh", argv: ["200.0v"]}));
  test('should parse "vgh"', () => expect(parseCommand(" vgh, ?")).toMatchObject({command: "vgh", argv: ["?"]}));
  test('should parse "alm"', () => expect(parseCommand(" alm, vgh, ?")).toMatchObject({command: "alm", argv: ["vgh", "?"]}));
  test('should parse "rst"', () => expect(parseCommand(" rst, 1")).toMatchObject({command: "rst", argv: ["1"]}));
  test('should parse "rst"', () => expect(parseCommand(" rst, 0")).toMatchObject({command: "rst", argv: ["0"]}));
  test('should parse "rst"', () => expect(parseCommand(" rst, ?")).toMatchObject({command: "rst", argv: ["?"]}));
  test('should parse "dgi"', () => expect(parseCommand(" dgi, a, ?")).toMatchObject({command: "dgi", argv: ["a", "?"]}));
  test('should parse "dgi"', () => expect(parseCommand(" dgi, f, ?")).toMatchObject({command: "dgi", argv: ["f", "?"]}));
  test('should parse "dgi"', () => expect(parseCommand(" dgi, 1, ?")).toMatchObject({command: "dgi", argv: ["1", "?"]}));
  test('should parse "rly"', () => expect(parseCommand(" rly, 81, 1")).toMatchObject({command: "rly", argv: ["81", "1"]}));
  test('should parse "rly"', () => expect(parseCommand(" rly, 10, ?")).toMatchObject({command: "rly", argv: ["10", "?"]}));
  test('should parse "rly"', () => expect(parseCommand(" rly, a, 0")).toMatchObject({command: "rly", argv: ["a", "0"]}));
  test('should parse "vin"', () => expect(parseCommand(" vin, ?")).toMatchObject({command: "vin", argv: ["?"]}));
  test('should parse "frq"', () => expect(parseCommand(" frq, ?")).toMatchObject({command: "frq", argv: ["?"]}));
  test('should parse "per"', () => expect(parseCommand(" per, ?")).toMatchObject({command: "per", argv: ["?"]}));
  test('should parse "ton"', () => expect(parseCommand(" ton, ?")).toMatchObject({command: "ton", argv: ["?"]}));
  test('should parse "dty"', () => expect(parseCommand(" dty, ?")).toMatchObject({command: "dty", argv: ["?"]}));
  test('should parse "bfu"', () => expect(parseCommand(" bfu, ?")).toMatchObject({command: "bfu", argv: ["?"]}));
});
