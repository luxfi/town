// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { Initializable } from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

import { IDrop } from './interfaces/IDrop.sol';
import { IMedia } from './interfaces/IMedia.sol';
import { ILux } from './interfaces/ILux.sol';
import { IERC721Burnable } from './interfaces/IERC721Burnable.sol';
import { IUniswapV2Pair } from './uniswapv2/interfaces/IUniswapV2Pair.sol';

import './console.sol';


contract App is UUPSUpgradeable, OwnableUpgradeable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private dropIDs;

  // Declare an Event
  event Burn(address indexed from, uint256 indexed tokenID);
  event Mint(address indexed from, uint256 indexed tokenID);
  event Swap(address indexed owner, uint256 indexed tokenID, uint256 indexed chainID);

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
  IERC20 public lux;
  IUniswapV2Pair public pair;
  address public bridge;
  bool public unlocked;

  // Only bridge can call method
  modifier onlyBridge() {
    require(msg.sender == bridge);
    _;
  }

  // Ensure only owner can upgrade contract
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  // Initialize upgradeable contract
  function initialize() public initializer {
    __Ownable_init_unchained();
  }

  // Configure App
  function configure(
    address _media,
    address _lux,
    address _pair,
    address _bridge,
    bool _unlocked
  ) public onlyOwner {
    media = IMedia(_media);
    lux = IERC20(_lux);
    pair = IUniswapV2Pair(_pair);
    bridge = _bridge;
    unlocked = _unlocked;
  }

  // Add new drop
  function addDrop(address dropAddress) public onlyOwner returns (uint256) {
    require(dropAddresses[dropAddress] == 0, 'Drop already added');
    IDrop drop = IDrop(dropAddress);
    dropIDs.increment();
    uint256 dropID = dropIDs.current();
    drops[dropID] = dropAddress;
    dropAddresses[dropAddress] = dropID;
    emit AddDrop(dropAddress, drop.title(), drop.eggSupply());
    return dropID;
  }

  // Set price for buying a name
  function setNamePrice(uint256 price) public onlyOwner {
    namePrice = price.mul(10**18);
  }

  // Issue a new token to owner
  function mint(address owner, ILux.Token memory token) private returns (ILux.Token memory) {
    console.log('mint', owner, token.name);
    token = media.mintToken(owner, token);
    tokens[token.id] = token;
    emit Mint(owner, token.id);
    return token;
  }

  // Burn token owned by owner
  function burn(address owner, uint256 tokenID) private {
    console.log('burn', owner, tokenID);
    media.burnToken(owner, tokenID);
    tokens[tokenID].meta.burned = true;
    emit Burn(owner, tokenID);
  }

  // Swap to new chain requested
  function swap(
    address owner,
    uint256 tokenID,
    uint256 chainID
  ) external onlyBridge {
    console.log('swap', owner, tokenID);
    burn(owner, tokenID);
    tokens[tokenID].meta.swapped = true;
    emit Swap(owner, tokenID, chainID);
  }

  // Remint token swapped from another chain
  function remint(
    address owner,
    ILux.Token memory token
  ) external onlyBridge {
    mint(owner, token);
  }

  // Mint egg
  function mintNFT(uint256 dropID, address owner) internal returns (ILux.Token memory) {
    require(media.balanceOf(owner) < 3, 'Only 3 eggs allowed');

    // Get NFT for drop
    IDrop drop = IDrop(drops[dropID]);
    ILux.Token memory egg = drop.newNFT();

    // Mint NFT Token
    egg = mint(owner, egg);
    console.log('minted egg', egg.id);
    emit BuyNFT(owner, egg.id);
    return egg;
  }


  // Accept lux and return NFT NFT
  function buyNFT(uint256 dropID, address buyer) private returns (ILux.Token memory) {
    console.log('buyNFT', dropID);

    // Check egg price
    IDrop drop = IDrop(drops[dropID]);
    require(lux.balanceOf(buyer) >= drop.eggPrice(), 'Not enough lux');

    // Transfer funds
    console.log('Transfer lux', buyer, address(this), drop.eggPrice());
    lux.transferFrom(buyer, address(this), drop.eggPrice());

    // Mint and return NFT
    return mintNFT(dropID, buyer);
  }

  // Accept lux and return NFT NFT
  function buyNFTs(uint256 dropID, uint256 quantity) public {
    console.log('buyNFTs', dropID, quantity);
    for (uint8 i = 0; i < quantity; i++) {
      buyNFT(dropID, msg.sender);
    }
  }

  function buyNFTsBNB(uint256 dropID, uint256 quantity) public payable {
    console.log('buyNFTsBNB', dropID, quantity);

    // Ensure enough BNB was sent
    IDrop drop = IDrop(drops[dropID]);
    uint256 bnbPrice = (drop.eggPrice() + (18000 * (10 ** 18))) / luxPriceBNB(); // 420k lux in BNB
    console.log('msg.value', msg.value);
    console.log('bnbPrice', bnbPrice);
    console.log('drop.eggPrice', drop.eggPrice());
    console.log('luxPriceBNB()', luxPriceBNB());
    require(msg.value >= bnbPrice * quantity, "Not enough BNB");

    for (uint8 i = 0; i < quantity; i++) {
      mintNFT(dropID, msg.sender);
    }
  }

  // Calculate price of lux denominted in BNB based on pair reserves
  function luxPriceBNB() public view returns (uint256) {
    (uint luxAmount, uint bnbAmount,) = pair.getReserves();
    return luxAmount / bnbAmount;
  }

  // Return total amount of lux in contract
  function supplyBNB() public view returns (uint256) {
    return lux.balanceOf(address(this));
  }

  // Return total amount of lux in contract
  function supplyLUX() public view returns (uint256) {
    return lux.balanceOf(address(this));
  }

  // Enable owner to withdraw lux if necessary
  function withdrawBNB(address payable receiver, uint256 amount) public onlyOwner {
    require(receiver.send(amount));
  }

  // Enable owner to withdraw lux if necessary
  function withdrawlux(address receiver, uint256 amount) public onlyOwner {
    require(lux.transfer(receiver, amount));
  }

  // Helper to do fractional math
  function mul(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x, "Math overflow");
  }

  // Payable fallback functions
  receive() external payable {}
  fallback() external payable {}
}
