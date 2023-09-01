import {TextFileWriter} from "../TextFileWriter";
import {BaseDirectory, writeTextFile} from "@tauri-apps/api/fs";

export class ElectronTextFileWriter implements TextFileWriter {
  readonly #chunks: Array<string> = [];
  #filePath: string | null;

  get filePath(): string | null {
    return this.#filePath;
  }

  async close(): Promise<void> {
    const path = this.filePath;
    const data = this.#chunks.join("");
    this.#chunks.length = 0;
    return writeTextFile(path, data, {dir: BaseDirectory.Document});
  }

  async open(file: string): Promise<void> {
    this.#filePath = file;
  }

  async write(chunk: string): Promise<void> {
    this.#chunks.push(chunk);
  }
}
