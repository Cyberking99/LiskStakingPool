const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiskStakingPool Contract", function () {
  let liskToken, liskStakingPool, liskTokenAddress, liskStakingPoolAddress, owner, user1, user2;
  const poolRewardRate = ethers.parseUnits("1", 18);

  beforeEach(async function () {
    const LiskToken = await ethers.getContractFactory("LiskToken");
    liskToken = await LiskToken.deploy("LiskToken", "LTK", 18, 1000000);
    liskTokenAddress = await liskToken.getAddress();

    const LiskStakingPool = await ethers.getContractFactory("LiskStakingPool");
    liskStakingPool = await LiskStakingPool.deploy();
    liskStakingPoolAddress = await liskStakingPool.getAddress();

    [owner, user1, user2] = await ethers.getSigners();

    await liskToken.mint(user1.address, ethers.parseUnits("1000", 18));
    await liskToken.mint(user2.address, ethers.parseUnits("1000", 18));
  });

  describe("Pool management", function () {
    it("Should allow owner to add a new pool", async function () {
      await liskStakingPool.addPool(liskTokenAddress, poolRewardRate);
      const pool = await liskStakingPool.pools(1);
      expect(pool.stakingToken).to.equal(liskTokenAddress);
      expect(pool.rewardRate).to.equal(poolRewardRate);
    });

    it("Should not allow non-owner to add a new pool", async function () {
      await expect(liskStakingPool.connect(user1).addPool(liskTokenAddress, poolRewardRate)).to.be.revertedWith(
        "Error: You are not the owner"
      );
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      await liskStakingPool.addPool(liskTokenAddress, poolRewardRate);
    });

    it("Should allow user to stake tokens", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      const allowanceAmount = ethers.parseUnits("200", 18);

      await liskToken.connect(user1).approve(liskStakingPoolAddress, allowanceAmount);
      const allowance = await liskToken.allowance(user1.address, liskStakingPoolAddress);

      await liskStakingPool.connect(user1).stake(1, stakeAmount);

      const stakedBalance = await liskStakingPool.getStakedBalance(1, user1.address);
      expect(stakedBalance).to.equal(stakeAmount);

      const totalStaked = await liskStakingPool.pools(1).then((pool) => pool.totalStaked);
      expect(totalStaked).to.equal(stakeAmount);

      await expect(liskStakingPool.connect(user1).stake(1, stakeAmount))
        .to.emit(liskStakingPool, "Staked")
        .withArgs(user1.address, 1, stakeAmount);
    });

    it("Should allow user to withdraw staked tokens", async function () {
        const stakeAmount = ethers.parseUnits("100", 18);

        await liskToken.connect(user1).approve(liskStakingPoolAddress, stakeAmount);
        await liskStakingPool.connect(user1).stake(1, stakeAmount);

        const withdrawAmount = ethers.parseUnits("50", 18);
        await liskStakingPool.connect(user1).withdraw(1, withdrawAmount);

        const stakedBalance = await liskStakingPool.getStakedBalance(1, user1.address);

        const expectedBalance = stakeAmount-withdrawAmount;
        expect(stakedBalance).to.equal(expectedBalance);

        await expect(liskStakingPool.connect(user1).withdraw(1, withdrawAmount))
            .to.emit(liskStakingPool, "Withdrawn")
            .withArgs(user1.address, 1, withdrawAmount);
    });
  });

  describe("Reward Claiming", function () {
    beforeEach(async function () {
      await liskStakingPool.addPool(liskTokenAddress, poolRewardRate);
    });

    it("Should calculate rewards for a staker", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);

      await liskToken.connect(user1).approve(liskStakingPoolAddress, stakeAmount);
      await liskStakingPool.connect(user1).stake(1, stakeAmount);

      await ethers.provider.send("evm_mine", []);

      const reward = await liskStakingPool.calculateReward(1, user1.address);
      expect(reward).to.be.gt(0);
    });

    it("Should mint an NFT as reward upon claim", async function () {
        const stakeAmount = ethers.parseUnits("100", 18);

        await liskToken.connect(user1).approve(liskStakingPoolAddress, stakeAmount);
        await liskStakingPool.connect(user1).stake(1, stakeAmount);

        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine", []);

        const claim = await liskStakingPool.connect(user1).claimReward(1);

        const uri = await liskStakingPool.uri(1);

        await expect(liskStakingPool.connect(user1).claimReward(1))
            .to.emit(liskStakingPool, "RewardClaimed")
            .withArgs(user1.address, 2, 100000000000000000000n);
    });
  });
});
