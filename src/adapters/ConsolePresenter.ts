import { IPresentStats } from "../ports/IPresentStats";

export class ConsolePresenter implements IPresentStats {
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
