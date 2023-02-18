// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AuctionFactory.sol";

contract Auction is Ownable{

    enum State { OPEN, CLAIMED }

    State public currentState;
    uint256 private numberOfBidders;
    address private nftAddress;
    uint256 private tokenId;
    address private currentBidder;
    uint256 private currentBidValue;
    uint256 private endTime;
    uint256 private lastBidDate;
    ERC1155 private nft;
    AuctionsFactory private factory;

    constructor(address _nftAddress, uint256 _tokenId, uint256 startingPrice, address _nftOwner, address auctionFactory) {
        numberOfBidders = 0;
        nft = ERC1155(_nftAddress);
        setAuctionProperties(_nftAddress, _tokenId, startingPrice, _nftOwner);
        factory = AuctionsFactory(auctionFactory);
    }

    function setAuctionProperties(address _nftAddress, uint256 _tokenId, uint256 startingPrice, address _nftOwner) private {
        transferOwnership(_nftOwner);
        nftAddress = _nftAddress;
        tokenId = _tokenId;
        currentBidder = address(0);
        currentBidValue = startingPrice;
        endTime = block.timestamp + 20 minutes;
        currentState = State.OPEN;
    }

    function bid() public payable {
        require(numberOfBidders == 0 || (numberOfBidders == 1 && block.timestamp < 12 hours + lastBidDate) || (numberOfBidders > 1 && block.timestamp < 6 hours + lastBidDate) ,"The auction is closed");
        require(block.timestamp < endTime, "The auction is closed");
        require(msg.sender != currentBidder, "You cannot overbid yourself");
        require(msg.sender != owner(), "You are the owner of the Auction, you cannot bid");
        require(msg.value > currentBidValue, "You must overbid the current bid");
        if(msg.value > 0.5 ether) {
            endTime += 6 hours;
        }
        payable(currentBidder).transfer(currentBidValue);
        currentBidValue = msg.value;
        currentBidder = msg.sender;
        lastBidDate = block.timestamp;
        numberOfBidders += 1;
    }

    function endAuction() public payable {
        require(block.timestamp > endTime, "The auction is not over yet");
        require(currentState == State.OPEN, "The prize is already claimed");
        require(msg.sender == owner() || msg.sender == currentBidder, 'You are not allowed to end this auction');
        bytes memory emptyData = new bytes(0);
        nft.safeTransferFrom(owner(), currentBidder, tokenId, 1, emptyData);
        payable(owner()).transfer(currentBidValue);
        currentState = State.CLAIMED;
        factory.setAuctionState(nftAddress, tokenId, false);
    }

    function getNumberOfBidders() public view returns(uint256) {
        return numberOfBidders;
    }

    function getLastBidDate() public view returns(uint256) {
        return lastBidDate;
    }

    function getNFTOwner() public view returns(address){
        return owner();
    }

    function getNFTAddress() public view returns(address) {
        return nftAddress;
    }

    function getTokenId() public view returns(uint256) {
        return tokenId;
    }

    function getCurrentBidder() public view returns(address) {
        return currentBidder;
    }

    function getCurrentBidValue() public view returns(uint256) {
        return currentBidValue;
    }

    function getEndTime() public view returns(uint256) {
        return endTime;
    }

    function getTokenUri() public view returns(string memory) {
        return nft.uri(tokenId);
    }

    modifier nftOwner(address _nftAddress, uint256 _tokenId, address _nftOwner) {
        uint256 amount = nft.balanceOf(_nftOwner, _tokenId);
        require(amount > 0, "you are not the owner of the NFT");
        _;
    }
}