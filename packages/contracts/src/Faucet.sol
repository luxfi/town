// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Faucet is Ownable {
    using SafeMath for uint256;

    uint256 public rate = 100000;

    IERC20 token;

    event Fund(
        address indexed _address,
        uint256 indexed _amount
    );

    constructor(address zooAddress) {
        token = IERC20(zooAddress);
    }

    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    function fund(address to) public returns (uint256) {
        uint256 amount = rate.mul(10**18);
        require(amount <= token.balanceOf(address(this)));
        token.transfer(to, amount);
        emit Fund(msg.sender, amount);
        return amount;
    }

    function withdraw() public onlyOwner {
        token.transfer(owner(), token.balanceOf(address(this)));
    }

    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
