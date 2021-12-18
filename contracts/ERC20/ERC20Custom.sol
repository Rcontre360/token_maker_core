//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Custom is ERC20, Pausable, Ownable {
    enum Available {
        Burnable,
        Mintable,
        Pausable,
        Capped
    }

    uint256 private immutable _cap;
    uint8 private _decimals;
    mapping(Available => bool) public available;

    modifier isAvailable(Available field) {
        require(available[field], "CANNOT USE THIS FUNCTIONALITY");
        _;
    }

    constructor(
        uint256 supply,
        uint8 decimals,
        uint256 cap,
        string memory name,
        string memory symbol,
        bool[] memory availableFunctionality
    ) ERC20(name, symbol) {
        _cap = cap;
        _decimals = decimals;
        for (uint8 i = 0; i < 4; i++) available[Available(i)] = availableFunctionality[i];
        _mint(msg.sender, supply);
    }

    function burn(uint256 amount) public onlyOwner isAvailable(Available.Burnable) {
        _burn(_msgSender(), amount);
    }

    function cap() public view isAvailable(Available.Capped) returns (uint256) {
        return _cap;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function burnFrom(address account, uint256 amount) public isAvailable(Available.Burnable) {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        _approve(account, _msgSender(), currentAllowance - amount);
        _burn(account, amount);
    }

    function pause() public onlyOwner isAvailable(Available.Pausable) {
        super._pause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

    function mint(address account, uint256 amount)
        public
        onlyOwner
        isAvailable(Available.Mintable)
    {
        _mint(account, amount);
    }

    function _mint(address account, uint256 amount) internal override {
        require(ERC20.totalSupply() + amount <= _cap, "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }
}
