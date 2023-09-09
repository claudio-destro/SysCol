import {TextFileWriter, TextFileWriterEvents} from "../TextFileWriter";
import {createWriteStream, WriteStream} from "node:fs";

export class TextFileWriterImpl implements TextFileWriter {
  readonly #writer?: WriteStream;

  constructor(file: string) {
    this.#writer = createWriteStream(file);
  }

  get filePath(): string {
    return this.#writer.path.toString();
  }

  on<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void {
    this.#writer.on(event, listener);
  }

  once<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void {
    this.#writer.once(event, listener);
  }

  off<T extends keyof TextFileWriterEvents>(event: T, listener?: TextFileWriterEvents[T]): void {
    this.#writer.off(event, listener);
  }

  async close(): Promise<void> {
    this.#writer.close();
  }

  async write(chunk: string): Promise<void> {
    this.#writer.write(chunk);
  }
}
