import {readTextFile} from "@tauri-apps/api/fs";
import {TextFileReader} from "../TextFileReader";

export const tauriReadTextFile: TextFileReader = readTextFile;
