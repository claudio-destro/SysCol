import {readTextFile} from "@tauri-apps/api/fs";
import {TextFileReader} from "../TextFileReader";

export const TauriTextFileReader: TextFileReader = readTextFile;
