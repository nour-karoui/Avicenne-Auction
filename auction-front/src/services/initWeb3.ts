import {ExternalProvider} from "@ethersproject/providers";
import {ethers} from "ethers";
import {AuctionsFactoryABI, AuctionsFactoryAddress} from '../contracts/auctionsFactory';
import {AuctionABI} from "../contracts/auction";

declare global {
    interface Window {
        ethereum: ExternalProvider;
    }
}

export const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : undefined;

export const signer = provider ? provider.getSigner() : undefined;

export const getWalletAddress = async () => {
    if (!window.ethereum) {
        return null;
    }
    await provider?.send("eth_requestAccounts", []);
    return provider?.getSigner().getAddress();
}

export const getWalletBalance = async () => {
    if (!window.ethereum){
        return null;
    }
    await provider?.send("eth_requestAccounts", []);
    const balance = await provider?.getSigner().getBalance();
    return ethers.utils.formatEther(balance ?? 0);
}

export const auctionsFactory = new ethers.Contract(AuctionsFactoryAddress, AuctionsFactoryABI, signer);

export const getAuctionAddress = async (index: number) => {
    return await auctionsFactory.getAuctionAddressByIndex(index);
};

export const getAuction = async (address: string) => {
    return new ethers.Contract(address, AuctionABI, signer);
};