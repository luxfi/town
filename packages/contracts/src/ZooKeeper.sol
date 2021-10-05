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
import { IZoo } from './interfaces/IZoo.sol';
import { IERC721Burnable } from './interfaces/IERC721Burnable.sol';
import { IUniswapV2Pair } from './uniswapv2/interfaces/IUniswapV2Pair.sol';

import './console.sol';


contract ZooKeeper is Ownable {
// contract ZooKeeper is UUPSUpgradeable, OwnableUpgradeable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private dropIDs;

  // Declare an Event
  event AddDrop(address indexed dropAddress, string title, uint256 eggSupply);
  event Breed(address indexed from, uint256 parentA, uint256 parentB, uint256 indexed eggID);
  event Burn(address indexed from, uint256 indexed tokenID);
  event BuyEgg(address indexed from, uint256 indexed eggID);
  event Free(address indexed from, uint256 indexed tokenID, uint256 indexed yield);
  event Hatch(address indexed from, uint256 eggID, uint256 indexed tokenID);
  event Mint(address indexed from, uint256 indexed tokenID);
  event Swap(address indexed owner, uint256 indexed tokenID, uint256 indexed chainID);

  // Mapping of Address to Drop ID
  mapping(uint256 => address) public drops;

  // Mapping of ID to Address
  mapping(address => uint256) public dropAddresses;

  // Mapping of ID to NFT
  mapping(uint256 => IZoo.Token) public tokens;

  // Price to set name of Token
  uint256 public namePrice;

  // External contracts
  IMedia public media;
  IERC20 public zoo;
  IUniswapV2Pair public pair;
  address public bridge;
  bool public unlocked;

  // Only bridge can call method
  modifier onlyBridge() {
    require(msg.sender == bridge);
    _;
  }

  // // Ensure only owner can upgrade contract
  // function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  // // Initialize upgradeable contract
  // function initialize() public initializer {
  //   __Ownable_init_unchained();
  // }

  // Configure ZooKeeper
  function configure(
    address _media,
    address _zoo,
    address _pair,
    address _bridge,
    bool _unlocked
  ) public onlyOwner {
    media = IMedia(_media);
    zoo = IERC20(_zoo);
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
  function mint(address owner, IZoo.Token memory token) private returns (IZoo.Token memory) {
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
    IZoo.Token memory token
  ) external onlyBridge {
    mint(owner, token);
  }

  // Mint egg
  function mintEgg(uint256 dropID, address owner) internal returns (IZoo.Token memory) {
    require(media.balanceOf(owner) < 3, 'Only 3 eggs allowed');

    // Get Egg for drop
    IDrop drop = IDrop(drops[dropID]);
    IZoo.Token memory egg = drop.newEgg();

    // Mint Egg Token
    egg = mint(owner, egg);
    console.log('minted egg', egg.id);
    emit BuyEgg(owner, egg.id);
    return egg;
  }


  // Accept ZOO and return Egg NFT
  function buyEgg(uint256 dropID, address buyer) private returns (IZoo.Token memory) {
    console.log('buyEgg', dropID);

    // Check egg price
    IDrop drop = IDrop(drops[dropID]);
    require(zoo.balanceOf(buyer) >= drop.eggPrice(), 'Not enough ZOO');

    // Transfer funds
    console.log('Transfer ZOO', buyer, address(this), drop.eggPrice());
    zoo.transferFrom(buyer, address(this), drop.eggPrice());

    // Mint and return NFT
    return mintEgg(dropID, buyer);
  }

  // Accept ZOO and return Egg NFT
  function buyEggs(uint256 dropID, uint256 quantity) public {
    console.log('buyEggs', dropID, quantity);
    for (uint8 i = 0; i < quantity; i++) {
      buyEgg(dropID, msg.sender);
    }
  }

  function buyEggsBNB(uint256 dropID, uint256 quantity) public payable {
    console.log('buyEggsBNB', dropID, quantity);

    // Ensure enough BNB was sent
    IDrop drop = IDrop(drops[dropID]);
    uint256 bnbPrice = (drop.eggPrice() + (18000 * (10 ** 18))) / zooPriceBNB(); // 420k ZOO in BNB
    console.log('msg.value', msg.value);
    console.log('bnbPrice', bnbPrice);
    console.log('drop.eggPrice', drop.eggPrice());
    console.log('zooPriceBNB()', zooPriceBNB());
    require(msg.value >= bnbPrice * quantity, "Not enough BNB");

    for (uint8 i = 0; i < quantity; i++) {
      mintEgg(dropID, msg.sender);
    }
  }

  // Import Egg for V2 users
  function importEgg(address mediaV2, uint256 tokenID, uint256 dropID) public payable returns (IZoo.Token memory) {
    console.log('importEgg', mediaV2, tokenID, dropID);
    IERC721Burnable v2 = IERC721Burnable(mediaV2); // V2 Eggs

    // Import V2 Egg
    require(v2.ownerOf(tokenID) == msg.sender, "Not owner of NFT");
    v2.burn(tokenID);

    // Ensure enough BNB was sent
    IDrop drop = IDrop(drops[dropID]);
    uint256 bnbPrice = zooPriceBNB() * (drop.eggPrice() + (18000 * (10 ** 18))); // 378k ZOO in BNB
    console.log("zooPriceBNB()", zooPriceBNB());
    console.log("drop.eggPrice()", drop.eggPrice());
    console.log("bnbPrice", bnbPrice);
    console.log("msg.value", msg.value);
    require(msg.value >= bnbPrice, "Not enough BNB");

    // Mint them a shiny new egg
    return mintEgg(dropID, msg.sender);
  }

  // DISABLED FOR NOW
  // // Burn egg and randomly return an animal NFT
  // function hatchEgg(uint256 dropID, uint256 eggID) public returns (IZoo.Token memory) {
  //   require(unlocked, 'Game is not unlocked yet');

  //   console.log('hatchEgg', dropID, eggID);

  //   require(media.tokenExists(eggID), 'Egg is burned or does not exist');

  //   // Get animal for given Egg
  //   IZoo.Token memory animal = getAnimal(dropID, eggID);
  //   animal.meta.eggID = eggID;
  //   animal.meta.dropID = dropID;
  //   console.log('animal', animal.name);

  //   // ...it's hatching!
  //   animal = mint(msg.sender, animal);
  //   console.log('minted animal', animal.id, eggID);

  //   // bye egg
  //   burn(msg.sender, eggID);
  //   console.log('burned', eggID);

  //   emit Hatch(msg.sender, eggID, animal.id);
  //   return animal;
  // }

  // Ensure animals can breed
  // modifier canBreed(uint256 parentA, uint256 parentB) {
  //   console.log('canBreed', parentA, parentB);

  //   require(media.tokenExists(parentA) && media.tokenExists(parentB), 'Non-existent token');
  //   require(keccak256(abi.encode(parentA)) != keccak256(abi.encode(parentB)), 'Not able to breed with self');
  //   require(breedReady(parentA) && breedReady(parentB), 'Wait for cooldown to finish.');
  //   require(isBaseAnimal(parentA) && isBaseAnimal(parentB), 'Only BASE_ANIMAL can breed.');
  //   _;
  // }


  // // Breed two animals and create a hybrid egg
  // function breedAnimals(
  //   uint256 dropID,
  //   uint256 tokenA,
  //   uint256 tokenB
  // ) public canBreed(tokenA, tokenB) returns (IZoo.Token memory) {
  //   console.log('breedAnimals', dropID, tokenA, tokenB);

  //   IZoo.Token memory egg = IDrop(drops[dropID]).newHybridEgg(IZoo.Parents({ animalA: tokens[tokenA].name, animalB: tokens[tokenB].name, tokenA: tokenA, tokenB: tokenB }));

  //   // Update breeding delay for each parent
  //   updateBreedDelays(tokenA, tokenB);

  //   egg = mint(msg.sender, egg);
  //   emit Breed(msg.sender, tokenA, tokenB, egg.id);
  //   return egg;
  // }

  // // Freeing an animal burns the animal NFT and returns the ZOO to the owner
  // function freeAnimal(uint256 tokenID) public returns (uint256 yield) {
  //   console.log('freeAnimal', tokenID);

  //   IZoo.Token memory token = tokens[tokenID];

  //   // Burn the token
  //   burn(msg.sender, tokenID);

  //   // How long did we HODL?
  //   uint256 blockAge = block.number - token.birthday;
  //   uint256 daysOld = blockAge.div(28800);

  //   // Calculate yield
  //   yield = daysOld.mul(token.rarity.yield.mul(10**18));
  //   console.log('calculateYield', blockAge, daysOld, yield);

  //   // Transfer yield
  //   zoo.transfer(msg.sender, yield);

  //   emit Free(msg.sender, tokenID, yield);

  //   return yield;
  // }

  // // Buy a custom name for your NFT
  // function buyName(uint256 tokenID, string memory customName) public {
  //   require(zoo.balanceOf(msg.sender) < namePrice, 'ZK: Not enough ZOO to purchase Name');

  //   zoo.transferFrom(msg.sender, address(this), namePrice);

  //   IZoo.Token memory token = tokens[tokenID];
  //   token.customName = customName;
  //   tokens[tokenID] = token;
  // }

  // // Temporary random function
  // function unsafeRandom() private view returns (uint256) {
  //   uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.number, msg.sender, block.timestamp))) % 10000;
  //   return randomNumber;
  // }

  // // Ensure base animal
  // function isBaseAnimal(uint256 tokenID) private view returns (bool) {
  //   return tokens[tokenID].kind == IZoo.Type.BASE_ANIMAL;
  // }

  // // Get a random base or hybrid animal based on a given egg
  // function getAnimal(uint256 dropID, uint256 eggID) private view returns (IZoo.Token memory) {
  //   console.log('getAnimal', dropID, eggID);

  //   // Get Egg
  //   IZoo.Token memory egg = tokens[eggID];

  //   // Get random animal or hybrid from Drop
  //   if (egg.kind == IZoo.Type.BASE_EGG) {
  //     console.log('getRandomAnimal', dropID, eggID);
  //     return IDrop(drops[dropID]).getRandomAnimal(unsafeRandom());
  //   } else {
  //     console.log('getRandomHybrid', dropID, eggID);
  //     return IDrop(drops[dropID]).getRandomHybrid(unsafeRandom(), egg.parents);
  //   }
  // }

  // // Update breed delays
  // function updateBreedDelays(uint256 parentA, uint256 parentB) private {
  //   console.log('updateBreedDelays', parentA, parentB);

  //   tokens[parentA].breed.count++;
  //   tokens[parentB].breed.count++;
  //   tokens[parentA].breed.timestamp = block.timestamp;
  //   tokens[parentB].breed.timestamp = block.timestamp;
  // }

  // // Get next timestamp token can be bred
  // function breedNext(uint256 tokenID) public view returns (uint256) {
  //   IZoo.Token memory token = tokens[tokenID];
  //   return token.breed.timestamp + (token.breed.count * 1 days);
  // }

  // // Check whether token is ready to breed again
  // function breedReady(uint256 tokenID) public view returns (bool) {
  //   // Never bred? Lets go
  //   if (tokens[tokenID].breed.count == 0) {
  //     return true;
  //   }
  //   // If current timestamp is greater than the next breed time, lets go
  //   if (block.timestamp > breedNext(tokenID)) {
  //     return true;
  //   }

  //   // Not ready
  //   return false;
  // }

  // Calculate price of ZOO denominted in BNB based on pair reserves
  function zooPriceBNB() public view returns (uint256) {
    (uint zooAmount, uint bnbAmount,) = pair.getReserves();
    return zooAmount / bnbAmount;
  }

  // Return total amount of ZOO in contract
  function supplyBNB() public view returns (uint256) {
    return zoo.balanceOf(address(this));
  }

  // Return total amount of ZOO in contract
  function supplyZOO() public view returns (uint256) {
    return zoo.balanceOf(address(this));
  }

  // Enable owner to withdraw ZOO if necessary
  function withdrawBNB(address payable receiver, uint256 amount) public onlyOwner {
    require(receiver.send(amount));
  }

  // Enable owner to withdraw ZOO if necessary
  function withdrawZOO(address receiver, uint256 amount) public onlyOwner {
    require(zoo.transfer(receiver, amount));
  }

  // Helper to do fractional math
  function mul(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x, "Math overflow");
  }

  // Payable fallback functions
  receive() external payable {}
  fallback() external payable {}
}
