// SPDX-License-Identifier: GPL-3.0
// FOR TEST PURPOSES ONLY. NOT PRODUCTION SAFE

pragma solidity >=0.8.4;

import { IAuctionHouse } from "../interfaces/IAuctionHouse.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// This contract is meant to mimic a bidding contract that does not implement on IERC721 Received,
// and thus should cause a revert when an auction is finalized with this as the winning bidder.
contract BadBidder {
    address auction;
    address zoo;

    constructor(address _auction, address _zoo) {
        auction = _auction;
        zoo = _zoo;
    }

    function placeBid(uint256 auctionID, uint256 amount) external payable {
        IAuctionHouse(auction).createBid(auctionID, amount);
    }

    function approve(address spender, uint256 amount) external payable {
        IERC20(zoo).approve(spender, amount);
    }

    receive() external payable {}
    fallback() external payable {}
}
