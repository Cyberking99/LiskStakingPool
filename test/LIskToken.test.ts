import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import "@nomicfoundation/hardhat-chai-matchers";

describe("LiskToken", function () {
    let liskToken: Contract;
    const initialSupply = ethers.parseUnits("1000000", 18);

    beforeEach(async function () {
        const LiskToken = await ethers.getContractFactory("LiskToken");
        liskToken = await LiskToken.deploy("LiskToken", "LTK", 18, initialSupply);
    });

    it("should have the correct name and symbol", async function () {
        expect(await liskToken.name()).to.equal("LiskToken");
        expect(await liskToken.symbol()).to.equal("LTK");
    });

    it("should assign the total supply to the owner", async function () {
        const [owner] = await ethers.getSigners();
        
        const balance = await liskToken.balanceOf(owner.address);
        const totalSupply = ethers.parseUnits(`${initialSupply}`, 18);
        expect(balance).to.equal(totalSupply);
    });

    it("should transfer tokens correctly", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await liskToken.transfer(addr1.address, ethers.parseUnits("100", 18));
        expect(await liskToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
    });

    it("should emit Transfer event on transfer", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await expect(liskToken.transfer(addr1.address, ethers.parseUnits("100", 18)))
            .to.emit(liskToken, "Transfer")
            .withArgs(owner.address, addr1.address, ethers.parseUnits("100", 18));
    });

    it("should fail if insufficient balance for transfer", async function () {
        const [owner, addr1] = await ethers.getSigners();
        const amount = ethers.parseUnits("1000001", 18);
        const excessiveAmount = ethers.parseUnits(`${amount}`, 18);

        await expect(liskToken.transfer(addr1.address, excessiveAmount))
            .to.be.revertedWith("Not enough tokens");
    });


    it("should fail to transfer more tokens than available", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await liskToken.transfer(addr1.address, ethers.parseUnits("100", 18));
        await expect(liskToken.connect(addr1).transfer(owner.address, ethers.parseUnits("200", 18)))
            .to.be.revertedWith("Not enough tokens");
    });
});
