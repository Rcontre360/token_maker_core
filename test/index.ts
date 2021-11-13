import {expect} from "chai";
import {create} from "domain";
import {ethers} from "hardhat";
import {ERC20Custom} from "../types";

const getArgs = ({
  burnable,
  mintable,
  pausable,
  capped,
}: Record<string, boolean>) => ({
  supply: "10000",
  decimals: 5,
  cap: "100000",
  name: "Mock",
  symbol: "MCK",
  availableFunctionality: [
    burnable || false,
    mintable || false,
    pausable || false,
    capped || false,
  ],
});

const getPromises = (...promises: Promise<unknown>[]) => {
  return Promise.all(promises);
};

const createContract = async ({
  supply,
  decimals,
  cap,
  name,
  symbol,
  availableFunctionality,
}: ReturnType<typeof getArgs>) => {
  const ERC20Custom = await ethers.getContractFactory("ERC20Custom");
  return await ERC20Custom.deploy(
    supply,
    decimals,
    cap,
    name,
    symbol,
    availableFunctionality
  );
};

describe("ERC20Custom", function () {
  const args = getArgs({burnable: true, capped: true, pausable: true, mintable: true});
  let erc20Custom: ERC20Custom;

  beforeEach(async () => {
    erc20Custom = await createContract(args);
  });

  it("Should initialize properly", async function () {
    const ERC20Custom = await ethers.getContractFactory("ERC20Custom");
    const erc20Custom = await ERC20Custom.deploy(
      args.supply,
      args.decimals,
      args.cap,
      args.name,
      args.symbol,
      args.availableFunctionality
    );
    const [owner] = await ethers.getSigners();
    await erc20Custom.deployed();

    const [name, symbol, totalSupply, ownerSupply, decimals, capital] =
      await getPromises(
        erc20Custom.name(),
        erc20Custom.symbol(),
        erc20Custom.totalSupply(),
        erc20Custom.balanceOf(owner.address),
        erc20Custom.decimals(),
        erc20Custom.cap()
      );
    expect(await erc20Custom.totalSupply()).to.equal("10000");
    expect(name).to.equal(args.name);
    expect(symbol).to.equal(args.symbol);
    expect(totalSupply).to.equal(args.supply);
    expect(totalSupply).to.equal(ownerSupply);
    expect(decimals).to.equal(args.decimals);
    expect(capital).to.equal(args.cap);
  });

  it("Should initialize functionality params", async () => {
    const availableFunctionality = await getPromises(
      ...args.availableFunctionality.map((arg, i) => erc20Custom.available(i))
    );
    expect(availableFunctionality).to.satisfy((arr: boolean[], i: number) =>
      arr.every((isOn, i) => isOn === args.availableFunctionality[i])
    );
  });

  it("Should allow burn only if allowed", async () => {
    const noBurnableArgs = getArgs({});
    const noBurnable = await createContract(noBurnableArgs);
    await expect(noBurnable.burn("100")).to.be.revertedWith('')
    await expect(erc20Custom.burn("100")).not.to.be.revertedWith('')
  });

  it("Should allow mint only if allowed", async () => {
    const [owner] = await ethers.getSigners();
    const noMintableArgs = getArgs({});
    const noMintable = await createContract(noMintableArgs);
    await expect(noMintable.mint(owner.address, "100")).to.be.revertedWith('')
    await expect(erc20Custom.mint(owner.address, "100")).not.to.be.revertedWith('')
  });

  it("Should allow pause only if allowed", async () => {
    const noPausableArgs = getArgs({});
    const noPausable = await createContract(noPausableArgs);
    await expect(noPausable.pause()).to.be.revertedWith('')
    await expect(erc20Custom.pause()).not.to.be.revertedWith('')
  });

  it("Should allow cap only if allowed", async () => {
    const noCappedArgs = getArgs({});
    const noCapped = await createContract(noCappedArgs);
    await expect(noCapped.cap()).to.be.revertedWith('')
    await expect(erc20Custom.cap()).not.to.be.revertedWith('')
  });
});
