// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { IZoo } from "./IZoo.sol";

interface IDrop {
    function title() external view returns (string memory);
    function eggPrice() external view returns (uint256);
    function eggSupply() external view returns (uint256);
    function newEgg() external returns (IZoo.Token memory);
    function newHybridEgg(IZoo.Parents memory) external returns (IZoo.Token memory);
    function getRandomAnimal(uint256) external view returns (IZoo.Token memory);
    function getRandomHybrid(uint256, IZoo.Parents memory) external view returns (IZoo.Token memory);
}
