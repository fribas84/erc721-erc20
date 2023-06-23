// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    address private _owner;


    modifier onlyOwner {
        require(msg.sender == _owner, "Minting is only allowed for the owner.");
        _;
    }
    constructor(string memory _name, string memory _symbol)
    ERC721(_name, _symbol) {
        _owner = msg.sender;
    }

    function mint(address _user, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    function mint(string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}