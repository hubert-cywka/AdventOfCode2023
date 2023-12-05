import { readFileSync } from "fs";

export class FileReader {
    static getLines(filePath: string): string[] {
        return readFileSync(filePath)
            .toString()
            .split("\r\n")
            .slice(0, -1);
    }
}
