import EventEmitter from "eventemitter3";
import {TextFileWriter, TextFileWriterEvents} from "../TextFileWriter";
import {BaseDirectory, writeTextFile} from "@tauri-apps/api/fs";

export class TextFileWriterImpl implements TextFileWriter {
  readonly #chunks: Array<string> = [];
  readonly #filePath: string;
  readonly #events = new EventEmitter<string>();

  constructor(file: string) {
    this.#filePath = file;
  }

  get filePath(): string {
    return this.#filePath;
  }

  on<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void {
    this.#events.on(event, listener);
  }

  once<T extends keyof TextFileWriterEvents>(event: T, listener: TextFileWriterEvents[T]): void {
    this.#events.once(event, listener);
  }

  off<T extends keyof TextFileWriterEvents>(event: T, listener?: TextFileWriterEvents[T]): void {
    this.#events.off(event, listener);
  }

  async close(): Promise<void> {
    const path = this.filePath;
    const data = this.#chunks.join("");
    this.#chunks.length = 0;
    return writeTextFile(path, data, {dir: BaseDirectory.Document}).finally(() => this.#events.emit("close"));
  }

  async write(chunk: string): Promise<void> {
    this.#chunks.push(chunk);
  }
}
