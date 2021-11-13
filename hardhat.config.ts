import * as dotenv from "dotenv";

import {HardhatUserConfig} from "hardhat/config";
//import "@nomiclabs/hardhat-etherscan";
//import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-ethers";
//import "hardhat-gas-reporter";
//import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    //ropsten: {
    //url: process.env.ROPSTEN_URL || "",
    //accounts:
    //process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    //},
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  //gasReporter: {
  //enabled: process.env.REPORT_GAS !== undefined,
  //currency: "USD",
  //},
  //etherscan: {
  //apiKey: process.env.ETHERSCAN_API_KEY,
  //},
};

export default config;
