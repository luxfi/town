// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { Initializable } from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

import { Decimal } from './Decimal.sol';
import { IDrop } from './interfaces/IDrop.sol';
import { IMedia } from './interfaces/IMedia.sol';
import { IMarket } from './interfaces/IMarket.sol';
import { ILux } from './interfaces/ILux.sol';

import './console.sol';

contract App is UUPSUpgradeable, OwnableUpgradeable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private dropIds;

  // Declare an Event
  event AddDrop(address indexed dropAddress, string title);
  event Burn(address indexed from, uint256 indexed tokenId);
  event Mint(uint256 indexed tokenId, ILux.Token token);

  // Mapping of Address to Drop ID
  mapping(uint256 => address) public drops;

  // Mapping of ID to Address
  mapping(address => uint256) public dropAddresses;

  // Mapping of ID to NFT
  mapping(uint256 => ILux.Token) public tokens;

  // Price to set name of Token
  uint256 public namePrice;

  // External contracts
  IMedia public media;

  // Ensure only owner can upgrade contract
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  // Initialize upgradeable contract
  function initialize() public initializer {
    __Ownable_init_unchained();
  }

  // Configure App
  function configure(address _media) public onlyOwner {
    media = IMedia(_media);
  }

  // Add new drop
  function addDrop(address dropAddress) public onlyOwner returns (uint256) {
    require(dropAddresses[dropAddress] == 0, 'Drop already added');
    IDrop drop = IDrop(dropAddress);
    dropIds.increment();
    uint256 dropId = dropIds.current();
    drops[dropId] = dropAddress;
    dropAddresses[dropAddress] = dropId;
    emit AddDrop(dropAddress, drop.title());
    return dropId;
  }

  function mintMany(
    uint256 dropId,
    string memory name,
    uint256 quantity
  ) public onlyOwner {
    for (uint256 i = 0; i < quantity; i++) {
      mint(dropId, name);
    }
  }

  // Issue a new token to owner
  function mint(uint256 dropId, string memory name) public onlyOwner returns (ILux.Token memory) {
    IDrop drop = IDrop(drops[dropId]);

    // Get NFT for drop
    ILux.Token memory token = drop.newNFT(name);

    token = media.mintToken(msg.sender, token);

    drop.setFirstTokenId(name, token.id);

    console.log('mint', msg.sender, token.name, token.id);

    tokens[token.id] = token;

    emit Mint(token.id, token);

    return token;
  }

  // Burn token owned by owner
  function burn(address owner, uint256 tokenId) private {
    console.log('burn', owner, tokenId);
    media.burnToken(owner, tokenId);
    tokens[tokenId].meta.burned = true;
    emit Burn(owner, tokenId);
  }

  // Mint egg
  // function mintNFT(uint256 dropId, address owner) internal returns (ILux.Token memory) {
  //   // Get NFT for drop
  //   IDrop drop = IDrop(drops[dropId]);
  //   ILux.Token memory token = drop.newNFT();

  //   // Mint NFT Token
  //   egg = mint(egg);
  //   console.log('minted egg', egg.id);
  //   emit BuyNFT(owner, egg.id);
  //   return egg;
  // }

  // Accept ETH and return NFT NFT
  function buyNFT(uint256 dropId, uint256 tokenId) public payable returns (IMarket.Bid memory) {
    console.log('buyNFT', dropId, tokenId);

    // Check egg price
    IDrop drop = IDrop(drops[dropId]);
    // require(lux.balanceOf(buyer) >= drop.tokenPrice(), 'Not enough lux');

    // Check if Ask exist in Market for this token
    // The ask can represent ETH or any ERC20 we support
    // if not use the default drop.tokenPrice() in ETH

    // Transfer funds
    console.log('Transfer ETH (tokenId,value,tokenPrice)', tokenId, msg.value, drop.tokenTypeAsk(tokens[tokenId].name));

    // struct Bid {
    //   // Amount of the currency being bid
    //   uint256 amount;
    //   // Address to the ERC20 token being used to bid
    //   address currency;
    //   // Address of the bidder
    //   address bidder;
    //   // Address of the recipient
    //   address recipient;
    //   // % of the next sale to award the current owner
    //   Decimal.D256 sellOnShare;
    // }
    IMarket.Bid memory bid = IMarket.Bid(
      msg.value, // amount
      address(0), // currency
      address(msg.sender), // bidder
      address(msg.sender), // recipient
      Decimal.D256(0) // sellOnShare
    );

    // Mint and return NFT
    media.setBidFromApp(tokenId, bid);

    return bid;
  }

  // Enable owner to withdraw lux if necessary
  function withdraw(address payable receiver, uint256 amount) public onlyOwner {
    require(receiver.send(amount));
  }

  // Helper to do fractional math
  function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require(y == 0 || (z = x * y) / y == x, 'Math overflow');
  }

  // Payable fallback functions
  receive() external payable {}

  fallback() external payable {}
}
