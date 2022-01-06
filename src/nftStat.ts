import { IProvideMetadatas } from "./ports/IProvideMetadatas";
import { IPresentStats } from "./ports/IPresentStats";
import { ConsolePresenter } from "./adapters/ConsolePresenter";
import { LocalFileMetadataProvider } from "./adapters/LocalFileMetadataProvider";
import { Hexagon } from "./Hexagon";

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

main(metadatasPath)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
