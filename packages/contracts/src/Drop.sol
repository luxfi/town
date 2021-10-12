// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Decimal } from './Decimal.sol';
import { IMarket } from './interfaces/IMarket.sol';
import { IMedia } from './interfaces/IMedia.sol';
import { ILux } from './interfaces/ILux.sol';

import './console.sol';

contract Drop is Ownable {
  using SafeMath for uint256;

  struct TokenType {
    ILux.Type kind;
    string name;
    IMarket.Ask ask;
    uint256 supply;
    uint256 timestamp; // time created
    uint256 minted; // amount minted
    uint256 firstTokenId;
    IMedia.MediaData data;
    IMarket.BidShares bidShares;
  }

  // Title of drop
  string public title;

  // Address of ZooKeeper contract
  address public appAddress;

  // mapping of TokenType name to TokenType
  mapping(string => TokenType) public tokenTypes;

  // Ensure only ZK can call method
  modifier onlyApp() {
    require(appAddress == msg.sender, 'LuxDrop: Only App can call this method');
    _;
  }

  constructor(string memory _title) {
    title = _title;
  }

  function totalMinted(string memory name) public view returns (uint256) {
    return getTokenType(name).minted;
  }

  // Configure current App
  function configure(address _appAddress) public onlyOwner {
    appAddress = _appAddress;
  }

  // Add or configure a given kind of tokenType
  function setTokenType(
    ILux.Type kind,
    string memory name,
    IMarket.Ask memory ask,
    uint256 supply,
    string memory tokenURI,
    string memory metadataURI
  ) public onlyOwner returns (TokenType memory) {
    TokenType memory tokenType;
    tokenType.kind = kind;
    tokenType.name = name;
    tokenType.ask = ask;
    tokenType.supply = supply;
    tokenType.data = getMediaData(tokenURI, metadataURI);
    tokenType.bidShares = getBidShares();
    tokenTypes[name] = tokenType;
    return tokenType;
  }

  // Return price for current EggDrop
  function tokenTypeAsk(string memory name) public view returns (IMarket.Ask memory) {
    return getTokenType(name).ask;
  }

  function tokenSupply(string memory name) public view returns (uint256) {
    return getTokenType(name).supply;
  }

  function setFirstTokenId(string memory name, uint256 _firstTokenId) external onlyApp {
    if (tokenTypes[name].minted == 1) {
      tokenTypes[name].firstTokenId = _firstTokenId;
    }
  }

  function firstTokenId(string memory name) public view returns (uint256) {
    return getTokenType(name).firstTokenId;
  }

  // Return a new TokenType Token
  function newNFT(string memory name) external onlyApp returns (ILux.Token memory) {
    TokenType memory tokenType = getTokenType(name);
    require(tokenSupply(name) == 0 || tokenType.minted < tokenSupply(name), 'Out of tokens');

    tokenType.minted++;
    tokenTypes[tokenType.name] = tokenType;

    // Convert tokenType into a token
    return
      ILux.Token({
        kind: tokenType.kind,
        name: tokenType.name,
        id: 0,
        timestamp: block.timestamp,
        data: tokenType.data,
        bidShares: tokenType.bidShares,
        meta: ILux.Meta(0, 0, false)
      });
  }

  // Get TokenType by name
  function getTokenType(string memory name) public view returns (TokenType memory) {
    return tokenTypes[name];
  }

  // Helper to construct IMarket.BidShares struct
  function getBidShares() private pure returns (IMarket.BidShares memory) {
    return
      IMarket.BidShares({
        creator: Decimal.D256(uint256(0).mul(Decimal.BASE)),
        owner: Decimal.D256(uint256(100).mul(Decimal.BASE)),
        prevOwner: Decimal.D256(uint256(0).mul(Decimal.BASE))
      });
  }

  // Helper to construct IMedia.MediaData struct
  function getMediaData(string memory tokenURI, string memory metadataURI) private pure returns (IMedia.MediaData memory) {
    return IMedia.MediaData({ tokenURI: tokenURI, metadataURI: metadataURI, contentHash: bytes32(0), metadataHash: bytes32(0) });
  }
}
