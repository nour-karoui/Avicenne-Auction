// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auction {
    address public nftAddress;
    uint256 public tokenId;
    address public currentBidder;
    uint256 public currentBidValue;
    uint256 public endTime;
    address public owner;
    ERC721 private nft;

    constructor(address _nftAddress, uint256 _tokenId, address _owner) {
        // verify that the nft belongs to msg sender
        nft = ERC721(_nftAddress);
        address nftOwner = nft.ownerOf(_tokenId);
        require(nftOwner == _owner, "You cannot put this NFT in Auction since you are not the owner");
        owner = _owner;
        nftAddress = _nftAddress;
        tokenId = _tokenId;
        currentBidder = address(0);
        currentBidValue = 0;
        endTime = block.timestamp + 72 hours;
    }

    function bid() public payable {
        require(msg.value > currentBidValue, "You must overbid the current bid");
        if(msg.value > 0.5 ether) {
            endTime += 6 hours;
        }
        payable(currentBidder).transfer(currentBidValue);
        currentBidValue = msg.value;
        currentBidder = msg.sender;
    }

    function endAuction() public payable {
        nft.safeTransferFrom(owner, currentBidder, tokenId);
        payable(owner).transfer(currentBidValue);
    }
}