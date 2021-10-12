// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { ILux } from './ILux.sol';
import { IMarket } from './IMarket.sol';

interface IDrop {
  function title() external view returns (string memory);

  function tokenTypeAsk(string memory name) external view returns (IMarket.Ask memory);

  function totalMinted(string memory name) external view returns (uint256);

  function tokenSupply(string memory name) external view returns (uint256);

  function newNFT(string memory name) external returns (ILux.Token memory);

  function setFirstTokenId(string memory name, uint256 _firstTokenId) external;
}
