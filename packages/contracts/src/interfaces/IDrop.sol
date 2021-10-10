// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { ILux } from './ILux.sol';

interface IDrop {
  function title() external view returns (string memory);

  function tokenPrice(string memory name) external view returns (uint256);

  function totalMinted(string memory name) external view returns (uint256);

  function tokenSupply(string memory name) external view returns (uint256);

  function newNFT() external returns (ILux.Token memory);
}
