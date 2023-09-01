import {TextFileReader} from "../TextFileReader";
import {readFile} from "node:fs/promises";

export const electronReadTextFile: TextFileReader = async (file: string): Promise<string> => {
  const data: Buffer = await readFile(file);
  return data.toString("utf8");
};
