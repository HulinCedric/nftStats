import { IProvideMetadatas } from "./ports/IProvideMetadatas";
import { IPresentStats } from "./ports/IPresentStats";

export class Hexagon {
  constructor(
    private metadataProvider: IProvideMetadatas,
    private presenter: IPresentStats
  ) { }

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

  private showTraitStats(displayer: IPresentStats) { }
}
