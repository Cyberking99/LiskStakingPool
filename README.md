# LiskStakingPool
A staking pool system where users can stake an LTK (ERC20 token), and receive a Non-Fungible Token (NFT) as a reward based on their stake duration and amount.

## Install dependencies:
```bash
npm install
```

## Compile Contracts:
```bash
npx hardhat compile
```
## Running Test
```bash
npx hardhat test
```

## Deploy the project
Rename **.env.sample** to **.env** and input your private key
```bash
npx hardhat run scripts/deploy.ts --network lisk-sepolia
```

## Verify Smart Contract
```bash
npx hardhat verify --network lisk-sepolia contract_address
```

Example:
```bash
npx hardhat verify --network lisk-sepolia 0x18Dc055ed8D98573D4518EE89EF50d6F4B74B528
```

## Deployed Contract Addresses
- LiskToken (LTK) - ERC20:
```plaintext
0x18Dc055ed8D98573D4518EE89EF50d6F4B74B528
```

- LiskCollections - ERC1155:
```plaintext
0xc4cEC323948bA761146ab946d5197e1Fc94bAE92
```

- LiskStakingPool:
```plaintext
0x5Bb921D8b6307A352B09338C877F661125811Df2
```

## Explorer Link
- Link to LiskToken (LTK) deployed smart contract on Lisk Testnet Explorer: [https://sepolia-blockscout.lisk.com/address/0x18Dc055ed8D98573D4518EE89EF50d6F4B74B528](https://sepolia-blockscout.lisk.com/address/0x18Dc055ed8D98573D4518EE89EF50d6F4B74B528)
- Link to LiskCollections NFT deployed smart contract on Lisk Testnet Explorer: [https://sepolia-blockscout.lisk.com/address/0xc4cEC323948bA761146ab946d5197e1Fc94bAE92](https://sepolia-blockscout.lisk.com/address/0xc4cEC323948bA761146ab946d5197e1Fc94bAE92)
- Link to LiskStakingPool deployed smart contract on Lisk Testnet Explorer: [https://sepolia-blockscout.lisk.com/address/0x5Bb921D8b6307A352B09338C877F661125811Df2](https://sepolia-blockscout.lisk.com/address/0x5Bb921D8b6307A352B09338C877F661125811Df2)