// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { ILux } from "./ILux.sol";

interface IDrop {
    function title() external view returns (string memory);
    function eggPrice() external view returns (uint256);
    function eggSupply() external view returns (uint256);
    function newNFT() external returns (ILux.Token memory);
    function newHybridEgg(ILux.Parents memory) external returns (ILux.Token memory);
    function getRandomAnimal(uint256) external view returns (ILux.Token memory);
    function getRandomHybrid(uint256, ILux.Parents memory) external view returns (ILux.Token memory);
}
