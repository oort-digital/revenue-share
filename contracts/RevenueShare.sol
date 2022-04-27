// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RevenueShare is Initializable, OwnableUpgradeable {
 
    address public acceptedPayTokenAddress;
    address public oortWithdrawlAddress;
    address public envelopWithdrawlAddress;
    
    //has 2 decimals
    // for example 100.5 = 10050
    uint16 public oortProportion;

    function initialize(
            address payTokenAddress,
            address oortAddress,
            address envelopAddress,
            uint16 proportion) initializer public {
        OwnableUpgradeable.__Ownable_init();
        acceptedPayTokenAddress = payTokenAddress;
        oortWithdrawlAddress = oortAddress;
        envelopWithdrawlAddress = envelopAddress;
        oortProportion = proportion;
    }

    function setOortWithdrawlAddress(address oortAddress) public onlyOwner {
        require(oortAddress != address(0), 'New oortWithdrawlAddress is the zero address');
        oortWithdrawlAddress = oortAddress;
    }

    function setEnvelopWithdrawlAddress(address envelopAddress) public onlyOwner {
        require(envelopAddress != address(0), 'New envelopWithdrawlAddress is the zero address');
        envelopWithdrawlAddress = envelopAddress;
    }

    function setOortProportion(uint16 proportion) public onlyOwner {
        require(proportion <= 10000, 'Cannot set proportion more that 10000');
        require(proportion > 0, 'Cannot set zero proportion');
        oortProportion = proportion;
    }

    function getTotalBalance() public view returns (uint256) {
        return IERC20(acceptedPayTokenAddress).balanceOf(address(this));
    }

    function getProportionalBalance(uint16 proportion) private view returns (uint256) {
        uint256 totalBalance = IERC20(acceptedPayTokenAddress).balanceOf(address(this));
        return totalBalance / 10000 * proportion;
    }

    function getOortBalance() public view returns (uint256) {
        return getProportionalBalance(oortProportion);
    }

    function getEnvelopBalance() public view returns (uint256) {
        return getProportionalBalance(10000 - oortProportion);
    }

    function withdrawl() public {
        uint256 oortBalance = getOortBalance();
        uint256 envelopBalance = getEnvelopBalance();
        IERC20(acceptedPayTokenAddress).transfer(oortWithdrawlAddress, oortBalance);
        IERC20(acceptedPayTokenAddress).transfer(envelopWithdrawlAddress, envelopBalance);
    }

}