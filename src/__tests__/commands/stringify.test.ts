import {stringifyHardwareCommand} from "../../script/protocol/stringifyHardwareCommand";

describe("stringifyHardwareCommand", () => {
  test('should stringify "ver"', () => expect(stringifyHardwareCommand("ver", "?")).toEqual("{sc,ver,?}"));
  test('should stringify "ver"', () => expect(stringifyHardwareCommand("ver", "x")).toEqual("{sc,ver,x}"));
  test('should stringify "car"', () => expect(stringifyHardwareCommand("car", "0fh")).toEqual("{sc,car,0fh}"));
  test('should stringify "car"', () => expect(stringifyHardwareCommand("car", "?")).toEqual("{sc,car,?}"));
  test('should stringify "dev"', () => expect(stringifyHardwareCommand("dev", "05h")).toEqual("{sc,dev,05h}"));
  test('should stringify "dev"', () => expect(stringifyHardwareCommand("dev", "?")).toEqual("{sc,dev,?}"));
  test('should stringify "dut"', () => expect(stringifyHardwareCommand("dut", "?")).toEqual("{sc,dut,?}"));
  test('should stringify "dut"', () => expect(stringifyHardwareCommand("dut", "c")).toEqual("{sc,dut,c}"));
  test('should stringify "dut"', () => expect(stringifyHardwareCommand("dut", "s")).toEqual("{sc,dut,s}"));
  test('should stringify "ddi"', () => expect(stringifyHardwareCommand("ddi", "l")).toEqual("{sc,ddi,l}"));
  test('should stringify "ddi"', () => expect(stringifyHardwareCommand("ddi", "h")).toEqual("{sc,ddi,h}"));
  test('should stringify "ddi"', () => expect(stringifyHardwareCommand("ddi", "?")).toEqual("{sc,ddi,?}"));
  test('should stringify "ddo"', () => expect(stringifyHardwareCommand("ddo", "6", "1")).toEqual("{sc,ddo,6,1}"));
  test('should stringify "ddo"', () => expect(stringifyHardwareCommand("ddo", "4", "?")).toEqual("{sc,ddo,4,?}"));
  test('should stringify "dai"', () => expect(stringifyHardwareCommand("dai", "00", "c")).toEqual("{sc,dai,00,c}"));
  test('should stringify "dai"', () => expect(stringifyHardwareCommand("dai", "14", "?")).toEqual("{sc,dai,14,?}"));
  test('should stringify "dao"', () => expect(stringifyHardwareCommand("dao", "1", "01bdh")).toEqual("{sc,dao,1,01bdh}"));
  test('should stringify "dao"', () => expect(stringifyHardwareCommand("dao", "5", "?")).toEqual("{sc,dao,5,?}"));
  test('should stringify "dvi"', () => expect(stringifyHardwareCommand("dvi", "1", "c")).toEqual("{sc,dvi,1,c}"));
  test('should stringify "dvi"', () => expect(stringifyHardwareCommand("dvi", "4", "?")).toEqual("{sc,dvi,4,?}"));
  test('should stringify "dag"', () => expect(stringifyHardwareCommand("dag", "0", "c")).toEqual("{sc,dag,0,c}"));
  test('should stringify "dag"', () => expect(stringifyHardwareCommand("dag", "2", "?")).toEqual("{sc,dag,2,?}"));
  test('should stringify "dmg"', () => expect(stringifyHardwareCommand("dmg", "1")).toEqual("{sc,dmg,1}"));
  test('should stringify "dmg"', () => expect(stringifyHardwareCommand("dmg", "?")).toEqual("{sc,dmg,?}"));
  test('should stringify "igl"', () => expect(stringifyHardwareCommand("igl", "2000.0ma")).toEqual("{sc,igl,2000.0ma}"));
  test('should stringify "igl"', () => expect(stringifyHardwareCommand("igl", "?")).toEqual("{sc,igl,?}"));
  test('should stringify "alm"', () => expect(stringifyHardwareCommand("alm", "?")).toEqual("{sc,alm,?}"));
  test('should stringify "alm"', () => expect(stringifyHardwareCommand("alm", "igl", "?")).toEqual("{sc,alm,igl,?}"));
  test('should stringify "alm"', () => expect(stringifyHardwareCommand("alm", "vgl", "?")).toEqual("{sc,alm,vgl,?}"));
  test('should stringify "alm"', () => expect(stringifyHardwareCommand("alm", "vgh", "?")).toEqual("{sc,alm,vgh,?}"));
  test('should stringify "vgl"', () => expect(stringifyHardwareCommand("vgl", "24.000v")).toEqual("{sc,vgl,24.000v}"));
  test('should stringify "vgl"', () => expect(stringifyHardwareCommand("vgl", "2.000v")).toEqual("{sc,vgl,2.000v}"));
  test('should stringify "vgl"', () => expect(stringifyHardwareCommand("vgl", "2.1v")).toEqual("{sc,vgl,2.1v}"));
  test('should stringify "vgl"', () => expect(stringifyHardwareCommand("vgl", "?")).toEqual("{sc,vgl,?}"));
  test('should stringify "vgh"', () => expect(stringifyHardwareCommand("vgh", "200.0v")).toEqual("{sc,vgh,200.0v}"));
  test('should stringify "vgh"', () => expect(stringifyHardwareCommand("vgh", "?")).toEqual("{sc,vgh,?}"));
  test('should stringify "alm"', () => expect(stringifyHardwareCommand("alm", "vgh", "?")).toEqual("{sc,alm,vgh,?}"));
  test('should stringify "rst"', () => expect(stringifyHardwareCommand("rst", "1")).toEqual("{sc,rst,1}"));
  test('should stringify "rst"', () => expect(stringifyHardwareCommand("rst", "0")).toEqual("{sc,rst,0}"));
  test('should stringify "rst"', () => expect(stringifyHardwareCommand("rst", "?")).toEqual("{sc,rst,?}"));
  test('should stringify "dgi"', () => expect(stringifyHardwareCommand("dgi", "a", "?")).toEqual("{sc,dgi,a,?}"));
  test('should stringify "dgi"', () => expect(stringifyHardwareCommand("dgi", "f", "?")).toEqual("{sc,dgi,f,?}"));
  test('should stringify "dgi"', () => expect(stringifyHardwareCommand("dgi", "1", "?")).toEqual("{sc,dgi,1,?}"));
  test('should stringify "rly"', () => expect(stringifyHardwareCommand("rly", "81", "1")).toEqual("{sc,rly,81,1}"));
  test('should stringify "rly"', () => expect(stringifyHardwareCommand("rly", "10", "?")).toEqual("{sc,rly,10,?}"));
  test('should stringify "rly"', () => expect(stringifyHardwareCommand("rly", "a", "0")).toEqual("{sc,rly,a,0}"));
  test('should stringify "vin"', () => expect(stringifyHardwareCommand("vin", "?")).toEqual("{sc,vin,?}"));
  test('should stringify "frq"', () => expect(stringifyHardwareCommand("frq", "?")).toEqual("{sc,frq,?}"));
  test('should stringify "per"', () => expect(stringifyHardwareCommand("per", "?")).toEqual("{sc,per,?}"));
  test('should stringify "ton"', () => expect(stringifyHardwareCommand("ton", "?")).toEqual("{sc,ton,?}"));
  test('should stringify "dty"', () => expect(stringifyHardwareCommand("dty", "?")).toEqual("{sc,dty,?}"));
  test('should stringify "bfu"', () => expect(stringifyHardwareCommand("bfu", "?")).toEqual("{sc,bfu,?}"));
});
