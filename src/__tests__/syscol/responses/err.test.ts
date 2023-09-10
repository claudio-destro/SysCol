import {parseCommandResponse} from "../../../protocols/syscol/parseCommandResponse";

describe("Tests malformed", () => {
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.1.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,9.1.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n").error).toBeTruthy());
  test('"TST" should be malformed', () => expect(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n").error).toBeTruthy());
});
