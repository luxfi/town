// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { IMedia } from "./IMedia.sol";
import { IMarket } from "./IMarket.sol";

interface ILux {
    enum Type {
        BASE_EGG,
        BASE_ANIMAL,
        HYBRID_EGG,
        HYBRID_ANIMAL
    }

    struct Rarity {
        string  name;
        uint256 probability;
        uint256 yield;
        uint256 boost;
    }

    struct Breed {
        uint256 count;
        uint256 timestamp;
    }

    struct Parents {
        string  animalA;
        string  animalB;
        uint256 tokenA;
        uint256 tokenB;
    }

    struct Meta {
        uint256 eggID;       // originating egg
        uint256 dropID;      // originating drop
        bool burned;         // token has been burned
        bool swapped;        // token has been swapped
    }

    struct Token {
        Rarity  rarity;
        Type  kind;
        string  name;
        uint256 id;           // unique ID
        uint256 timestamp;    // time created
        uint256 birthday;     // birth block
        string  customName;   // optional, paid feature
        Parents parents;
        Breed   breed;
        Meta meta;
        IMedia.MediaData data;
        IMarket.BidShares bidShares;
    }
}
