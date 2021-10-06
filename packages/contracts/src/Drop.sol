// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Decimal } from "./Decimal.sol";
import { IMarket } from "./interfaces/IMarket.sol";
import { IMedia } from "./interfaces/IMedia.sol";
import { ILux } from "./interfaces/ILux.sol";

import "./console.sol";


contract Drop is Ownable {
    using SafeMath for uint256;

    struct Egg {
        ILux.Type kind;
        string  name;
        uint256 supply;
        uint256 price;
        uint256 timestamp;    // time created
        uint256 birthday;     // birth block
        uint256 minted;       // amount minted
        IMedia.MediaData data;
        IMarket.BidShares bidShares;
    }

    struct Animal {
        ILux.Type kind;
        ILux.Rarity rarity;
        string name;
        IMedia.MediaData data;
        IMarket.BidShares bidShares;
    }

    struct Hybrid {
        ILux.Type kind;
        ILux.Rarity rarity;
        string name;
        uint256 yield;
        string parentA;
        string parentB;
        IMedia.MediaData data;
        IMarket.BidShares bidShares;
    }

    // Title of drop
    string public title;

    // Name of default base egg
    string public baseEgg;

    // Name of configured hybrid egg
    string public hybridEgg;

    // Address of ZooKeeper contract
    address public keeperAddress;

    // mapping of Rarity name to Rarity
    mapping (string => ILux.Rarity) public rarities;

    // mapping of Rarity name to []string of Animal names
    mapping (string => string[]) public rarityAnimals;

    // Rarity sorted by most rare -> least rare
    string[] public raritySorted;

    // mapping of Egg name to Egg
    mapping (string => Egg) public eggs;

    // mapping of Animal name to Animal
    mapping (string => Animal) public animals;

    // mapping of animal name to Hybrid
    mapping (string => Hybrid) public hybrids;

    // mapping of (parent + parent) to Hybrid
    mapping (string => Hybrid) public hybridParents;

    // Ensure only ZK can call method
    modifier onlyZoo() {
        require(
            keeperAddress == msg.sender, "ZooDrop: Only ZooKeeper can call this method"
        );
        _;
    }

    constructor(string memory _title) {
        title = _title;
    }

    function totalSupply() public view returns (uint256) {
        return getEgg(baseEgg).minted;
    }

    // Set current base and hybrid egg
    function configureEggs(string memory _baseEgg, string memory _hybridEgg) public onlyOwner {
        baseEgg = _baseEgg;
        hybridEgg = _hybridEgg;
    }

    // Configure current ZooKeeper
    function configureKeeper(address zooKeeper) public onlyOwner {
        keeperAddress = zooKeeper;
    }

    // Add or configure a given rarity
    function setRarity(string memory name, uint256 probability, uint256 yield, uint256 boost) public onlyOwner returns (bool) {
        require(probability > 0, "Rarity must be over zero");

        ILux.Rarity memory rarity = ILux.Rarity({
            name: name,
            probability: probability,
            yield: yield,
            boost: boost
        });

        // Save rarity
        rarities[rarity.name] = rarity;
        raritySorted.push(rarity.name);

        return true;
    }

    // Add or configure a given kind of egg
    function setEgg(string memory name, uint256 price, uint256 supply, string memory tokenURI, string memory metadataURI) public onlyOwner returns (Egg memory) {
        Egg memory egg;
        egg.name = name;
        egg.data = getMediaData(tokenURI, metadataURI);
        egg.bidShares = getBidShares();
        egg.price = price.mul(10**18);
        egg.supply = supply;
        eggs[name] = egg;
        return egg;
    }

    // Add or configure a given animal
    function setAnimal(string memory name, string memory rarity, string memory tokenURI, string memory metadataURI) public onlyOwner returns (bool) {
        Animal memory animal = Animal({
            kind: ILux.Type.BASE_ANIMAL,
            rarity: getRarity(rarity),
            name: name,
            data: getMediaData(tokenURI, metadataURI),
            bidShares: getBidShares()
        });

        // Save animal by name
        animals[name] = animal;

        // Try to add animal to rarity
        addAnimalToRarity(animal.rarity.name, animal.name);

        return true;
    }

    // Add or configure a given hybrid
    function setHybrid(string memory name, string memory rarity, uint256 yield, string memory parentA, string memory parentB, string memory tokenURI, string memory metadataURI) public onlyOwner returns (bool) {
        Hybrid memory hybrid = Hybrid({
            kind: ILux.Type.HYBRID_ANIMAL,
            name: name,
            rarity: getRarity(rarity),
            yield: yield,
            parentA: parentA,
            parentB: parentB,
            data: getMediaData(tokenURI, metadataURI),
            bidShares: getBidShares()
        });

        hybrids[name] = hybrid;
        hybridParents[parentsKey(parentA, parentB)] = hybrid;
        return true;
    }

    struct _Animal {
        string rarity;
        string name;
        string tokenURI;
        string metadataURI;
    }

    // Helper to set many Animal at once
    function setAnimals(_Animal[] calldata _animals) public onlyOwner {
        for (uint256 i = 0; i < _animals.length; i++) {
            _Animal calldata animal = _animals[i];
            setAnimal(animal.name, animal.rarity, animal.tokenURI, animal.metadataURI);
        }
    }

    struct _Hybrid {
        string rarity;
        string name;
        uint256 yield;
        string parentA;
        string parentB;
        string tokenURI;
        string metadataURI;
    }


    // Helper to set many Animal at once
    function setHybrids(_Hybrid[] calldata _hybrids) public onlyOwner {
        for (uint256 i = 0; i < _hybrids.length; i++) {
            _Hybrid calldata hybrid = _hybrids[i];
            setHybrid(hybrid.name, hybrid.rarity, hybrid.yield, hybrid.parentA, hybrid.parentB, hybrid.tokenURI, hybrid.metadataURI);
        }
    }


    // Add Animal to rarity set if it has not been seen before
    function addAnimalToRarity(string memory rarity, string memory name) private {
        string[] storage _animals = rarityAnimals[rarity];

        // Check if animal has been added to this rarity before
        for (uint256 i = 0; i < _animals.length; i++) {
            string memory known = _animals[i];
            if (keccak256(bytes(name)) == keccak256(bytes(known))) {
                // Not a new Animal
                return;
            }
        }

        // New animal lets add to rarity list
        _animals.push(name);

        // Ensure stored
        rarityAnimals[rarity] = _animals;
    }

    // Return price for current EggDrop
    function eggPrice() public view returns (uint256) {
        return getEgg(baseEgg).price;
    }

    function eggSupply() public view returns (uint256) {
        return getEgg(baseEgg).supply;
    }

    function hybridSupply() public view returns (uint256) {
        return getEgg(hybridEgg).supply;
    }

    // Return a new Egg Token
    function newNFT() external onlyZoo returns (ILux.Token memory) {
        Egg memory egg = getEgg(baseEgg);
        require(eggSupply() == 0 || egg.minted < eggSupply(), "Out of eggs");

        egg.minted++;
        eggs[egg.name] = egg;

        // Convert egg into a token
        return ILux.Token({
            rarity: getRarity('Common'),
            kind: ILux.Type.BASE_EGG,

            name: egg.name,
            birthday: block.number,
            timestamp: block.timestamp,
            data: egg.data,
            bidShares: egg.bidShares,

            parents: ILux.Parents("", "", 0, 0), // Common eggs have no parents

            id: 0,
            customName: "",
            breed: ILux.Breed(0, 0),
            meta: ILux.Meta(0, 0, false, false)
        });
    }

    // Return a new Hybrid Egg Token
    function newHybridEgg(ILux.Parents memory parents) external view onlyZoo returns (ILux.Token memory) {
        Egg memory egg = getEgg(hybridEgg);
        require(hybridSupply() == 0 || egg.minted < hybridSupply(), "Out of hybrid eggs");

        // Convert egg into a token
        return ILux.Token({
            rarity: getRarity('Common'),
            kind: ILux.Type.HYBRID_EGG,
            name: egg.name,
            birthday: block.number,
            timestamp: block.timestamp,
            data: egg.data,
            bidShares: egg.bidShares,

            parents: parents, // Hybrid parents

            id: 0,
            customName: "",
            breed: ILux.Breed(0, 0),
            meta: ILux.Meta(0, 0, false, false)
        });
    }

    // Get Egg by name
    function getEgg(string memory name) private view returns (Egg memory) {
        return eggs[name];
    }

    // Get Rarity by name
    function getRarity(string memory name) private view returns (ILux.Rarity memory) {
        return rarities[name];
    }

    // Get Animal by name
    function getAnimal(string memory name) private view returns (Animal memory) {
        return animals[name];
    }

    // Get Hybrid by name
    function getHybrid(string memory name) private view returns (Hybrid memory) {
        return hybrids[name];
    }

    // Chooses animal based on random number generated from(0-999)
    function getRandomAnimal(uint256 random) external view returns (ILux.Token memory token) {
        Animal memory animal;

        console.log('getRandomAnimal', random);
        console.log('raritySorted.length', raritySorted.length);

        // Find rarest animal choices first
        for (uint256 i = 0; i < raritySorted.length; i++) {
            string memory name = raritySorted[i];
            ILux.Rarity memory rarity = rarities[name];

            console.log('rarity.name', name);
            console.log('rarity.probability', rarity.probability);
            console.log('rarityAnimals', rarityAnimals[name][0], rarityAnimals[name][1]);

            // Highest probability first, failing that use lowest rarity (common) animal
            if (rarity.probability > random || i == raritySorted.length - 1) {
                string[] memory choices = rarityAnimals[name];
                animal = getAnimal(choices[random % choices.length]);
                break;
            }
        }

        // Return Token
        token.kind = ILux.Type.BASE_ANIMAL;
        token.name = animal.name;
        token.data = animal.data;
        token.rarity = animal.rarity;
        token.bidShares = animal.bidShares;
        token.timestamp = block.timestamp;
        token.birthday = block.number;

        console.log('randomAnimal', animal.name, animal.rarity.name, animal.rarity.yield);
        console.log('randomAnimal.data.tokenURI', animal.data.tokenURI);
        console.log('randomAnimal.data.metadataURI', animal.data.metadataURI);
        return token;
    }

    function getRandomHybrid(uint256 random, ILux.Parents memory parents) external view returns (ILux.Token memory token) {
        Hybrid[2] memory possible = [
            parentsToHybrid(parents.animalA, parents.animalB),
            parentsToHybrid(parents.animalB, parents.animalA)
        ];

        // pick array index 0 or 1 depending on the rarity
        Hybrid memory hybrid = possible[random % 2];

        // Return Token
        token.kind = ILux.Type.HYBRID_ANIMAL;
        token.name = hybrid.name;
        token.data = hybrid.data;
        token.rarity = hybrid.rarity;
        token.rarity.yield = hybrid.yield; // Hybrid rarity overrides default
        token.bidShares = hybrid.bidShares;
        token.timestamp = block.timestamp;
        token.birthday = block.number;
        token.parents = parents;
        return token;
    }

    // Helper to construct IMarket.BidShares struct
    function getBidShares() private pure returns (IMarket.BidShares memory) {
        return IMarket.BidShares({
            creator: Decimal.D256(uint256(10).mul(Decimal.BASE)),
            owner: Decimal.D256(uint256(80).mul(Decimal.BASE)),
            prevOwner: Decimal.D256(uint256(10).mul(Decimal.BASE))
        });
    }

    // Helper to construct IMedia.MediaData struct
    function getMediaData(string memory tokenURI, string memory metadataURI) private pure returns (IMedia.MediaData memory) {
        return IMedia.MediaData({
            tokenURI: tokenURI,
            metadataURI: metadataURI,
            contentHash: bytes32(0),
            metadataHash: bytes32(0)
        });
    }

    // Get key for two parents
    function parentsKey(string memory animalA, string memory animalB) private pure returns (string memory) {
        return string(abi.encodePacked(animalA, animalB));
    }

    // Get Hybrid from Parents
    function parentsToHybrid(string memory nameA, string memory nameB) private view returns (Hybrid memory) {
        return hybridParents[parentsKey(nameA, nameB)];
    }

    // Return the higher of two rarities
    function higher(ILux.Rarity memory rarityA, ILux.Rarity memory rarityB) private pure returns (ILux.Rarity memory) {
        if (rarityA.probability < rarityB.probability) {
            return rarityA;
        }
        return rarityB;
    }
}
