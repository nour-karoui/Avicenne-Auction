HELLO <img src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif" width="30px"> This is Auction-cienne
---

<p>
  <a href="https://github.com/nour-karoui/NFT-auction#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/nour-karoui/NFT-Auction/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/nour-karoui/NFT-Auction/blob/main/license" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/bishkou/password-pwnd" />
  </a>
</p>

## ✂️ How is this project divided?
The project is divided into 2 main sections:
1. ***Auction-truffle:*** The truffle project, containing all the smart contracts used for this project and their deployments configurations.
2. ***Auction's platform:*** The Dapp that allows users to auction with their NFT and participate in open auctions. [*Visit Auction-cienne*](http://auction-cienne.s3-website.eu-central-1.amazonaws.com/)

## 🙌 What is Auction-cienne?
It is a **decentralized app for NFT auction** hosted on **Goerli Testnet** built with ***Truffle Framework***, ***ReactJs*** and ***ethers.js*** library.
1. Any user can put his owned NFTs into auction.
2. Any user can participate in the auction and bid on an NFT.
3. The auction lasts 72 hours and gets 6 more hours with every bid more than 0.5 ETHER.
4. The first bidder wins after 12 hours without bids, the next bidders win after 6 hours only.


## 🎯 Running and Testing the project
> **In order to just run the DApp, you can skip this section since the smart contracts are already deployed. This section is for those who want to run, modify and test the smart contracts whether locally or in a testnet**

After cloning this repo, we will start with running and testing the blockchain part.
### 📒 The blockchain part

---

> Deploying the contract on a Testnet takes more time than deploying it locally so be patient.

Make sure to create .env file following the **.env.example** file

Run this command to install dependencies:
```shell
    cd auction-truffle
    npm install
```

**These are the main commands that would help you interact with our smart contracts:**
1. Compiling the contracts (this will generate a JSON file for each contract found in build/contracts)
    ```shell
        truffle compile
    ```
2. Deploying the contracts
    ```shell
        truffle migrate --network <NETWORK_NAME>
        truffle run verify <CONTRACT_NAME>
    ```
3. Interacting with the contracts
    ```shell
        truffle console --network <network-name>
    ```
### 🚀 Running The Auction-cienne's DApp

---

> **To run the DApp you need both a Metamask wallet attached to your Browser, and owned NFTs on Opensea, also you need some Goerli Ether**

> You can get some Goerli ETH on [This Faucet](https://goerlifaucet.com/).

<img width="358" alt="image" src="https://user-images.githubusercontent.com/47257753/211004734-9d0b3b93-606f-4270-9791-22ec10397e1b.png">

> You can create an NFT on [Testnet Opensea](https://testnets.opensea.io/asset/create).

#### Running the DApp
To interact with the auction-cienne app
```shell
    npm start
```
## 🔨 Areas of Improvements
1. Automating the contract deployment and integration with frontend (updating ABI and address).
2. Add unit tests to both smart contract and frontend.
3. Add events to smart contract and event listening to frontend.
4. Automate the process of transferring NFT at the end of the auction, (with chainlink client for eg).
