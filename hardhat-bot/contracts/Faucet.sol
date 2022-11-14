// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Faucet {

    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner {
        require(owner == msg.sender, "not owner of the contract");
        _;
    }

    // send eth/matic/celo to an address from the contract
    function transfer(address payable _to) public {
        uint _amountToSend = 0.1 ether; 
        (bool success, ) = _to.call{value: _amountToSend}("");
        require(success, "Failed to send Ether!");
    }

    // a function to withdraw funds 
    function withdrawFunds() onlyOwner public {
        uint amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to transfer tokens");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}