import {parseCommandResponse, wasCommandMalformed} from "../../script/protocol/parseCommandResponse";

describe("Tests malformed", () => {
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.1.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,9.1.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n").argv)).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n").argv)).toBeTruthy());
});
