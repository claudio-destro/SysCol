import {parseCommandResponse} from "../../script/protocol/parseCommandResponse";

describe("parseCommandResponse", () => {
  test('"VER" should not throw', () => expect(() => parseCommandResponse("{SC,VER,FWSC:1.4 HWSC:1.2 HWRM:1.3}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.0.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.0.0:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.0.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.0:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.2:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.3:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.4:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.5:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.6:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.7:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.8:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.9:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.10:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.11:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.12:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.13:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.13:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.14:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.15:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.15:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.1.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.2:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.3:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.4:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.5:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.6:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.0:PASS 0A:0514d +A:0317d -A:0713d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.1:FAIL 0A:0516d +A:0480d -A:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.1:PASS 0A:0516d +A:0479d -A:0553d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.2:PASS 0A:0518d +A:0477d -A:0556d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.3:PASS 0A:0516d +A:0404d -A:0628d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.3:PASS 0A:0515d +A:0404d -A:0629d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:FAIL 0A:0517d +A:0401d -A:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0631d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0631d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0632d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.5:PASS 0A:0005d +A:0633d -A:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.6:PASS 0V:0515d +V:0153d -V:0877d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.7:PASS 0V:0514d +V:0155d -V:0875d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.8:PASS 0V:0514d +V:0156d -V:0876d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.9:PASS 0V:0515d +V:0158d -V:0876d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.10:FAIL 0V:0515d +V:0158d -V:0000d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.10:PASS 0V:0516d +V:0156d -V:0877d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.10:FAIL 0V:0516d +V:0157d -V:0518d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.10:FAIL 0V:0516d +V:0156d -V:0518d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0515d +V:0157d -V:0877d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0517d +V:0168d -V:0877d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.14:FAIL 0V:0516d +V:0158d -V:0877d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0517d +V:0156d -V:0878d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.0.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.0.2:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.0.3:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.0.4:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.1:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.2:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.2:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.3:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.3:FAIL}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.0.0:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,7.0.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.2:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.3:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.4:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.6.1:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.6.2:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.6.3:PASS}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.0.1:PASS Vint:0846d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.0.2:PASS Vint:0774d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.0.3:PASS Vint:0444d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.0.4:FAIL Vint:0943d}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.0:PASS +15V :15.27V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.1:PASS +15V :15.24V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.2:FAIL +15V :00.01V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.3:PASS +15V :15.24V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.4:PASS +15V :15.24V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.5:PASS +15V :15.26V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.6:PASS +15V :15.28V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.7:PASS +15V :15.23V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.8:PASS +15V :15.23V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.9:FAIL +15VG:17.58V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.10:FAIL +15VG:17.57V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.11:FAIL -15V :17.26V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.12:FAIL -15V :17.25V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.13:FAIL -15V :17.25V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.14:FAIL -15V :17.24V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.15:FAIL -15V :00.01V}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,9.1.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.1:PASS FRQ:004950Hz TON:0098.95us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.2:PASS FRQ:004950Hz TON:0099.06us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.3:PASS FRQ:004950Hz TON:0098.96us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.4:PASS FRQ:004950Hz TON:0099.06us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.5:PASS FRQ:004950Hz TON:0099.06us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.6:PASS FRQ:004950Hz TON:0098.96us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.7:PASS FRQ:003999Hz TON:0112.52us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.8:PASS FRQ:003999Hz TON:0112.51us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.9:FAIL FRQ:000000Hz TON:0000.00us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.10:PASS FRQ:007998Hz TON:0050.03us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.11:FAIL FRQ:000000Hz TON:0000.00us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.12:FAIL FRQ:000000Hz TON:0000.00us}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n")).not.toThrow());
  test('"TST" should not throw', () => expect(() => parseCommandResponse("{SC,TST,b.0.1:PASS}\n")).not.toThrow());
});
