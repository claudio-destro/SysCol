import {parseCommandResponse, wasCommandMalformed} from "../../script/parseCommandResponse";

describe("Tests malformed", () => {
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.1.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.2.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,7.3.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.5.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,8.6.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,9.1.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n")[1])).toBeTruthy());
  test('"TST" should be malformed', () => expect(wasCommandMalformed(parseCommandResponse("{SC,TST,a.0.??,x,ERR}\n")[1])).toBeTruthy());
});