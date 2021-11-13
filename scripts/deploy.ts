// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {scrypt} from "crypto";
import {ethers} from "hardhat";

const contractConfig = {
  supply: "10000",
  decimals: "5",
  cap: "10000",
  name: "Mock",
  symbol: "MCK",
  availableFunctionality: [true, true, true, true],
};

async function main() {
  const {supply, decimals, cap, name, symbol, availableFunctionality} = contractConfig
  const ERC20Custom = await ethers.getContractFactory("ERC20Custom");
  const erc20Custom = await ERC20Custom.deploy(supply, decimals, cap, name, symbol, availableFunctionality);

  await erc20Custom.deployed();
  console.log(`Deployed to ${erc20Custom.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
