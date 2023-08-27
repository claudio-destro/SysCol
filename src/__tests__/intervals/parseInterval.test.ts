import {parseInterval} from "../../script/macros/parseInterval";

describe("parseInterval", () => {
  test("should not throw", () => expect(() => parseInterval("1 ")).not.toThrow());
  test("should not throw", () => expect(() => parseInterval("1μs ")).not.toThrow());
  test("should not throw", () => expect(() => parseInterval("1us ")).not.toThrow());
  test("should not throw", () => expect(() => parseInterval("1ms ")).not.toThrow());
  test("should not throw", () => expect(() => parseInterval("1s ")).not.toThrow());
  test("should not throw", () => expect(() => parseInterval("1m ")).not.toThrow());
  test("should throw", () => expect(() => parseInterval("1x")).toThrow());
  test("should throw", () => expect(() => parseInterval("1?")).toThrow());
  test("should parse 1000μs", () => expect(parseInterval("1000μs")).toEqual(1));
  test("should parse 1μs", () => expect(parseInterval("1μs")).toEqual(1 / 1_000));
  test("should parse 1μs", () => expect(parseInterval("1us")).toEqual(1 / 1_000));
  test("should parse 1ms", () => expect(parseInterval("1")).toEqual(1));
  test("should parse 1ms", () => expect(parseInterval("1ms")).toEqual(1));
  test("should parse 1s", () => expect(parseInterval("1s")).toEqual(1_000));
  test("should parse 1.5s", () => expect(parseInterval("1.5s")).toEqual(1_500));
  test("should parse 1m", () => expect(parseInterval("1m")).toEqual(60_000));
});
