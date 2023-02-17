// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import './Auction.sol';

contract AuctionsFactory {
    mapping(string => bool) public openAuctions;
    mapping(uint256 => address) public totalAuctions;
    uint256 public totalAuctionsCount;

    constructor() {
        totalAuctionsCount = 0;
    }

    function createNewAuction(address _nftAddress, uint256 _tokenId) payable public {
        require(openAuctions[concatTokenProperties(_nftAddress, _tokenId)] == false, 'This NFT is in an open Auction');
        Auction auction = new Auction(_nftAddress, _tokenId, msg.sender, address(this));
        setAuctionState(_nftAddress, _tokenId, true);
        appendAuction(address(auction));
    }

    function appendAuction(address auction) private {
        totalAuctions[totalAuctionsCount] = auction;
        totalAuctionsCount ++;
    }

    function setAuctionState(address _nftAddress, uint256 _tokenId, bool state) public payable{
        openAuctions[concatTokenProperties(_nftAddress, _tokenId)] = state;
    }

    function concatTokenProperties(address _nftAddress, uint256 _tokenId) private pure returns(string memory) {
        return string.concat(Strings.toHexString(uint160(_nftAddress), 20), Strings.toString(_tokenId));
    }

    function getAuctionAddressByIndex(uint256 index) view public returns (address) {
        require(totalAuctions[index] != address(0), 'This Auction Does Not Exist');
        return totalAuctions[index];
    }
}