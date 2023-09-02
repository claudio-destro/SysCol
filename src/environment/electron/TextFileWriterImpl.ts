import {TextFileWriter} from "../TextFileWriter";
import {createWriteStream, WriteStream} from "node:fs";

export class TextFileWriterImpl implements TextFileWriter {
  readonly #writer?: WriteStream;

  constructor(file: string) {
    this.#writer = createWriteStream(file);
  }

  get filePath(): string {
    return this.#writer.path.toString();
  }

  onclose = (): void => {
    /* EMPTY */
  };

  async close(): Promise<void> {
    this.#writer.close(this.onclose);
  }

  async write(chunk: string): Promise<void> {
    this.#writer.write(chunk);
  }
}
