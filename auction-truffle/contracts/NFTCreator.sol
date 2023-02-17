// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoleculeNFT is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mintPatent(string memory _tokenURI) payable public returns(address, uint256){
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        setTokenURI(tokenId, _tokenURI);
        _tokenIds.increment();
        return (address(this), tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public payable {
        require(ownerOf(tokenId) == msg.sender, "Sorry but you are not the owner of this NFT");
        _setTokenURI(tokenId, _tokenURI);
    }
}
