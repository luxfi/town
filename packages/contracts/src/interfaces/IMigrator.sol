// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import 'luxdefi/solidity/contracts/interfaces/IERC20.sol';

interface IMigrator {
  // Take the current LP token address and return the new LP token address.
  // Migrator should have full access to the caller's LP token.
  function migrate(IERC20 token) external returns (IERC20);
}
