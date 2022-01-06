import fs from "fs";
import { readFile } from "fs/promises";
import { IProvideMetadatas } from "../ports/IProvideMetadatas";

export class LocalFileMetadataProvider implements IProvideMetadatas {
  constructor(private path: string) { }

  async provideMetadatas(): Promise<any[]> {
    const files = fs.readdirSync(this.path);
    const filesHandles = [];
    const metadatas: any[] = [];

    for (const file of files) {
      filesHandles.push(
        readFile(this.path + "/" + file).then((data) => {
          metadatas.push(JSON.parse(data.toString()));
        })
      );
    }
    await Promise.all(filesHandles);

    return metadatas;
  }
}
