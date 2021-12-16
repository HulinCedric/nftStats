import fs from "fs";
import { readFile } from "fs/promises";
import { ethers } from "ethers";
import fetch from "cross-fetch";
// const fetch = (args:any) => import('node-fetch').then(({default: fetch}) => fetch(args));

const fateNFT = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

async function main(contractAddress: string) {
  const bsc = "https://bsc-dataseed.binance.org/";
  const eth = "https://cloudflare-eth.com";
  const provider = new ethers.providers.JsonRpcProvider(eth);

  const abi = [
    "function tokenURI(uint256 _tokenId) external view returns (string)",
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log("Contract address:", contract.address);

  let count = 1;
  const limit = 10;
  const stats = {};
  while (count < limit) {
    let url = await contract.tokenURI(count);
    console.log(url);

    const ipfsRegex = /ipfs:\/\/(.*)/;

    const match = url.match(ipfsRegex);
    if (match) {
      url = "https://gateway.pinata.cloud/ipfs/" + match[1];
      console.log("New url = " + url);
    }

    const response = await fetch(url);

    const metadatas = (await response.json()) as any;
    console.log(metadatas);

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

    count++;
  }

  console.log("Displaying stats");
  console.log(stats);

  Object.entries(stats).forEach(([key, value]) => {
    console.log(key);

    Object.entries(value as any).forEach(([vkey, vvalue]) => {
      console.log(vkey + " : " + vvalue);
    });

    console.log("");
  });
}

main(fateNFT)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
