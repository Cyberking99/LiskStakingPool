import { expect } from 'chai';
import { ethers } from 'hardhat';
import { AddressZero } from "@ethersproject/constants";
import { LiskCollections } from '../typechain/LiskCollections';

describe('LiskCollections', () => {
  let liskCollections: LiskCollections;
  let owner: string;
  let user1: string;
  let user2: string;

  beforeEach(async () => {
    const LiskCollectionsFactory = await ethers.getContractFactory('LiskCollections');
    liskCollections = await LiskCollectionsFactory.deploy();

    [owner, user1, user2] = await ethers.getSigners();
  });

  describe('balanceOf', () => {
    it('should return 0 for non-existent token', async () => {
      const balance = await liskCollections.balanceOf(user1.address, 1);
      expect(balance).to.equal(0);
    });

    it('should return correct balance after minting', async () => {
      await liskCollections.mint(user1.address, 1, 10, 'metadata');
      const balance = await liskCollections.balanceOf(user1.address, 1);
      expect(balance).to.equal(10);
    });
  });

  describe('balanceOfBatch', () => {
    it('should return correct balances for multiple tokens', async () => {
      await liskCollections.mint(user1.address, 1, 10, 'metadata');
      await liskCollections.mint(user1.address, 2, 20, 'metadata');
      const balances = await liskCollections.balanceOfBatch([user1.address, user1.address], [1, 2]);
      expect(balances).to.deep.equal([10, 20]);
    });
  });

  describe('setApprovalForAll', () => {
    it('should emit ApprovalForAll event', async () => {
      await expect(liskCollections.setApprovalForAll(user2.address, true))
        .to.emit(liskCollections, 'ApprovalForAll')
        .withArgs(owner, user2.address, true);
    });

    it('should update operator approval', async () => {
      await liskCollections.setApprovalForAll(user2.address, true);
      const isApproved = await liskCollections.isApprovedForAll(owner, user2.address);
      expect(isApproved).to.equal(true);
    });
  });

  describe('mint', () => {
    it('should emit TransferSingle event', async () => {
      await expect(liskCollections.mint(user1.address, 1, 10, 'metadata'))
        .to.emit(liskCollections, 'TransferSingle')
        .withArgs(owner, AddressZero, user1.address, 1, 10);
    });

    it('should update token metadata', async () => {
      await liskCollections.mint(user1.address, 1, 10, 'metadata');
      const metadata = await liskCollections.tokenMetadata(1);
      expect(metadata).to.equal('metadata');
    });
  });

  describe('mintBatch', () => {
    it('should emit TransferBatch event', async () => {
      await expect(liskCollections.mintBatch(user1.address, [1, 2], [10, 20], ['metadata1', 'metadata2']))
        .to.emit(liskCollections, 'TransferBatch')
        .withArgs(owner, AddressZero, user1.address, [1, 2], [10, 20]);
    });

    it('should update token metadata for multiple tokens', async () => {
      await liskCollections.mintBatch(user1.address, [1, 2], [10, 20], ['metadata1', 'metadata2']);
      const metadata1 = await liskCollections.tokenMetadata(1);
      const metadata2 = await liskCollections.tokenMetadata(2);
      expect(metadata1).to.equal('metadata1');
      expect(metadata2).to.equal('metadata2');
    });
  });

  describe('safeTransferFrom', () => {
    it('should emit TransferSingle event', async () => {
      await liskCollections.mint(user1.address, 1, 10, 'metadata');
      await liskCollections.connect(user1).setApprovalForAll(user2.address, true);
      await expect(liskCollections.connect(user2).safeTransferFrom(user1.address, user2.address, 1, 5))
        .to.emit(liskCollections, 'TransferSingle')
        .withArgs(user2.address, user1.address, user2.address, 1, 5);
    });

    it('should update token balance', async () => {
      await liskCollections.mint(user1.address, 1, 10, 'metadata');
      await liskCollections.connect(user1).setApprovalForAll(user2.address, true);
      await liskCollections.connect(user2).safeTransferFrom(user1.address, user2.address, 1, 5);
      const balance = await liskCollections.balanceOf(user1.address, 1);
      expect(balance).to.equal(5);
    });
  });

  describe('uri', () => {
    it('should return correct URI for token', async () => {
      await liskCollections.mint(user1.address, 1, 10, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0000FF"/></svg>');
      const uri = await liskCollections.uri(1);
      // console.log(await liskCollections.balanceOf(user1.address, 1));
      expect(uri).to.contain('data:application/json;base64,');
    });
  });
});