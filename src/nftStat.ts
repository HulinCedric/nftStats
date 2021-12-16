import fs from "fs";
import { readFile } from "fs/promises";

const metadatasPath = "./assets/Sample2/metadatas/";

async function main(path: string) {
  // const metadataProvider = new BlockChainMetadataProvider("http://", "otherRequiredParams");
  const metadataProvider: IProvideMetadatas = new LocalFileMetadataProvider(
    path
  );
  const presenter: IPresentStats = new ConsolePresenter();

  const hexagon = new Hexagon(metadataProvider, presenter);
  await hexagon.constructTraitStatsUseCase();
}

interface IPresentStats {
  presentStats(stats: any): void; // Not testable for the moment, because not MVP ?
}

class ConsolePresenter implements IPresentStats {
  presentStats(stats: any): void {
    Object.entries(stats).forEach(([key, value]) => {
      console.log(key);
      Object.entries(value as any).forEach(([vkey, vvalue]) => {
        console.log(vkey + " : " + vvalue);
      });
      console.log("");
    });
  }
}

interface IProvideMetadatas {
  provideMetadatas(): Promise<any[]>;
}

class LocalFileMetadataProvider implements IProvideMetadatas {
  constructor(private path: string) {}

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

class Hexagon {
  constructor(
    private metadataProvider: IProvideMetadatas,
    private presenter: IPresentStats
  ) {}

  async constructTraitStatsUseCase(): Promise<any> {
    const metadatas = await this.metadataProvider.provideMetadatas();
    const stats = this.constructTraitStatsWithMultiple(metadatas);
    this.presenter.presentStats(stats);
  }

  private constructTraitStatsWithMultiple(metadatas: any[]): any {
    const stats = {};
    for (const metadata of metadatas) {
      this.constructTraitStats(metadata, stats);
    }
    return stats;
  }

  private constructTraitStats(metadatas: any, stats: any): any {
    for (const attribute of metadatas.attributes) {
      if (!stats[attribute.trait_type]) {
        stats[attribute.trait_type] = { [attribute.value]: 1 };
      } else {
        if (!stats[attribute.trait_type][attribute.value]) {
          stats[attribute.trait_type][attribute.value] = 1;
        } else {
          stats[attribute.trait_type][attribute.value]++;
        }
      }
    }
  }

  private showTraitStats(displayer: IPresentStats) {}
}

main(metadatasPath)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
