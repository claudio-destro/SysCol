import {TextFileWriter} from "../TextFileWriter";
import {BaseDirectory, writeTextFile} from "@tauri-apps/api/fs";

export class TextFileWriterImpl implements TextFileWriter {
  readonly #chunks: Array<string> = [];
  readonly #filePath: string;

  constructor(file: string) {
    this.#filePath = file;
  }

  get filePath(): string {
    return this.#filePath;
  }

  async close(): Promise<void> {
    const path = this.filePath;
    const data = this.#chunks.join("");
    this.#chunks.length = 0;
    return writeTextFile(path, data, {dir: BaseDirectory.Document});
  }

  async write(chunk: string): Promise<void> {
    this.#chunks.push(chunk);
  }
}
