import fs from "fs";
import { readFile } from "fs/promises";

const metadatasPath = "./assets/Sample2/metadatas/";

async function main(path: string) {
  const files = fs.readdirSync(path);
  const stats = {};
  const filesHandles = [];

  for (const file of files) {
    filesHandles.push(
      readFile(path + "/" + file).then((data) => {
        const metadatas = JSON.parse(data.toString());

        for (const attribute of metadatas.attributes) {
          // console.log(attribute["trait_type"] + "->" + attribute["value"])
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
      })
    );
  }
  await Promise.all(filesHandles);

  //console.log(stats)
  Object.entries(stats).forEach(([key, value]) => {
    console.log(key);
    Object.entries(value as any).forEach(([vkey, vvalue]) => {
      console.log(vkey + " : " + vvalue);
    });
    console.log("");
  });
}

main(metadatasPath)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
