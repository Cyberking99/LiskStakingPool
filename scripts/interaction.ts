import { ethers } from "hardhat";

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const LiskTokenFactory = await ethers.getContractFactory("LiskToken");
    const liskToken = await LiskTokenFactory.deploy("Lisk Token", "LTK", 18, 1000000);
    const liskTokenAddress = await liskToken.getAddress();
    console.log(`LiskToken deployed to: ${liskTokenAddress}`);

    const LiskCollectionsFactory = await ethers.getContractFactory("LiskCollections");
    const liskCollections = await LiskCollectionsFactory.deploy();
    const liskCollectionsAddress = await liskCollections.getAddress();
    console.log(`LiskCollections deployed to: ${liskCollectionsAddress}`);

    const LiskStakingPoolFactory = await ethers.getContractFactory("LiskStakingPool");
    const liskStakingPool = await LiskStakingPoolFactory.deploy();
    const liskStakingPoolAddress = await liskStakingPool.getAddress();
    console.log(`LiskStakingPool deployed to: ${liskStakingPoolAddress}`);

    await liskToken.transfer(addr1.address, 100);
    console.log(`Transferred 100 tokens to ${addr1.address}`);

    const balance1 = await liskToken.balanceOf(addr1.address);
    console.log(`Addr1 Balance: ${balance1.toString()}`);

    await liskToken.approve(liskStakingPoolAddress, 50);
    console.log(`Approved 50 tokens for ${liskStakingPoolAddress}`);

    await liskCollections.mint(addr1.address, 1, 2, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0000FF"/></svg>');
    console.log(`Minted 2 tokens for ${addr1.address} with ID 1`);

    const balanceCollection = await liskCollections.balanceOf(addr1.address, 1);
    console.log(`Addr1 Collection Balance: ${balanceCollection.toString()}`);

    await liskStakingPool.addPool(liskTokenAddress, ethers.parseUnits("1", 18));
    console.log(`Added staking pool for ${liskTokenAddress}`);

    await liskStakingPool.stake(1, 50);
    console.log(`Staked 50 tokens in pool 1`);

    const stakedBalance = await liskStakingPool.getStakedBalance(1, addr1.address);
    console.log(`Addr1 Staked Balance: ${stakedBalance.toString()}`);

    await liskStakingPool.withdraw(1, 25);
    console.log(`Withdrew 25 tokens from pool 1`);

    const updatedStakedBalance = await liskStakingPool.getStakedBalance(1, addr1.address);
    console.log(`Updated Addr1 Staked Balance: ${updatedStakedBalance.toString()}`);

    await liskStakingPool.claimReward(1);
    console.log(`Claimed rewards for pool 1`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
