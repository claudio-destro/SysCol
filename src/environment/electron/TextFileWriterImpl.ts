import {TextFileWriter} from "../TextFileWriter";
import {createWriteStream, WriteStream} from "node:fs";

export class ElectronTextFileWriter implements TextFileWriter {
  #writer?: WriteStream;

  get filePath(): string | null {
    return this.#writer?.path.toString();
  }

  async close(): Promise<void> {
    this.#writer.close();
  }

  async open(file: string): Promise<void> {
    this.#writer = createWriteStream(file);
  }

  async write(chunk: string): Promise<void> {
    this.#writer.write(chunk);
  }
}
