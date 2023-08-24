import {parseCommandResponse} from "../../script/protocol/parseCommandResponse";
import {isTestPassed} from "../../script/protocol/getTestResult";

describe("Tests passed", () => {
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.0.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.0.0:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.0.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.0:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.2:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.3:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.4:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.5:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.6:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.7:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.8:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.9:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.10:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.11:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.12:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.1.14:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.2:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.3:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.4:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.5:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.2.6:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.0:PASS 0A:0514d +A:0317d -A:0713d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.1:PASS 0A:0516d +A:0479d -A:0553d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.2:PASS 0A:0518d +A:0477d -A:0556d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.3:PASS 0A:0516d +A:0404d -A:0628d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.3:PASS 0A:0515d +A:0404d -A:0629d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0631d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0632d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.5:PASS 0A:0005d +A:0633d -A:0000d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.6:PASS 0V:0515d +V:0153d -V:0877d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.7:PASS 0V:0514d +V:0155d -V:0875d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.8:PASS 0V:0514d +V:0156d -V:0876d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.9:PASS 0V:0515d +V:0158d -V:0876d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.10:PASS 0V:0516d +V:0156d -V:0877d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0515d +V:0157d -V:0877d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0517d +V:0168d -V:0877d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.3.14:PASS 0V:0517d +V:0156d -V:0878d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.0.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.0.2:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.0.3:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.0.4:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.0.0:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,7.0.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.5.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.5.2:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.5.3:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.5.4:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.6.1:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.6.2:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,8.6.3:PASS}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.0.1:PASS Vint:0846d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.0.2:PASS Vint:0774d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.0.3:PASS Vint:0444d}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.0:PASS +15V :15.27V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.1:PASS +15V :15.24V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.3:PASS +15V :15.24V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.4:PASS +15V :15.24V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.5:PASS +15V :15.26V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.6:PASS +15V :15.28V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.7:PASS +15V :15.23V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,9.1.8:PASS +15V :15.23V}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.1:PASS FRQ:004950Hz TON:0098.95us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.2:PASS FRQ:004950Hz TON:0099.06us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.3:PASS FRQ:004950Hz TON:0098.96us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.4:PASS FRQ:004950Hz TON:0099.06us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.5:PASS FRQ:004950Hz TON:0099.06us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.6:PASS FRQ:004950Hz TON:0098.96us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.7:PASS FRQ:003999Hz TON:0112.52us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.8:PASS FRQ:003999Hz TON:0112.51us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,a.0.10:PASS FRQ:007998Hz TON:0050.03us}\n")[1])).toBeTruthy());
  test('"TST" should pass', () => expect(isTestPassed(parseCommandResponse("{SC,TST,b.0.1:PASS}\n")[1])).toBeTruthy());
});
