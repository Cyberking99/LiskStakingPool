import { ethers } from "hardhat";

async function main() {
    const LiskToken = await ethers.getContractFactory("LiskToken");
    const liskToken = await LiskToken.deploy("LiskToken", "LTK", 18, 1000000);

    console.log("LiskToken deployed to:", await liskToken.getAddress());

    const LiskCollections = await ethers.getContractFactory("LiskCollections");
    const liskCollections = await LiskCollections.deploy();

    console.log("LiskCollections deployed to:", await liskCollections.getAddress());

    console.log("Minting initial NFT...");
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0000FF"/></svg>';
    const mintTx = await liskCollections.mint("0xA9d089B4C86623cc904061561c334e4120762472", 1, 1, svg);
    await mintTx.wait();

    console.log("Initial NFT minted!");

    const tokenURI = await liskCollections.uri(1);
    console.log("Token URI for minted NFT:", tokenURI);

    const LiskStakingPool = await ethers.getContractFactory("LiskStakingPool");
    const liskStakingPool = await LiskStakingPool.deploy();

    console.log("LiskStakingPool deployed to:", await liskStakingPool.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
