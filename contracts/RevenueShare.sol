// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RevenueShare is Initializable, OwnableUpgradeable {
 
    address public acceptedPayTokenAddress;
    address public oortWithdrawlAddress;
    address public envelopWithdrawlAddress;
    
    uint8 public oortProportion;

    function initialize(
            address payTokenAddress,
            address oortAddress,
            address envelopAddress,
            uint8 proportion) initializer public {
        OwnableUpgradeable.__Ownable_init();
        acceptedPayTokenAddress = payTokenAddress;
        oortWithdrawlAddress = oortAddress;
        envelopWithdrawlAddress = envelopAddress;
        oortProportion = proportion;
    }

    function setOortWithdrawlAddress(address oortAddress) public onlyOwner {
        oortWithdrawlAddress = oortAddress;
    }

    function setEnvelopWithdrawlAddress(address envelopAddress) public onlyOwner {
        envelopWithdrawlAddress = envelopAddress;
    }

    function setOortProportion(uint8 proportion) public onlyOwner {
        require(proportion <= 100, 'Cannot set proportion more that 100%');
        require(proportion > 0, 'Cannot be zero');
        oortProportion = proportion;
    }

    function getTotalBalance() public view returns (uint256) {
        return IERC20(acceptedPayTokenAddress).balanceOf(address(this));
    }

    function getProportionalBalance(uint8 proportion) private view returns (uint256) {
        uint256 totalBalance = IERC20(acceptedPayTokenAddress).balanceOf(address(this));
        return totalBalance / 100 * proportion;
    }

    function getOortBalance() public view returns (uint256) {
        return getProportionalBalance(oortProportion);
    }

    function getEnvelopBalance() public view returns (uint256) {
        return getProportionalBalance(100 - oortProportion);
    }

    function withdrawl() public {

        require(
            msg.sender == oortWithdrawlAddress ||
            msg.sender == envelopWithdrawlAddress
        , 'Caller has no permision');
        uint256 oortBalance = getOortBalance();
        uint256 envelopBalance = getEnvelopBalance();
        IERC20(acceptedPayTokenAddress).transfer(oortWithdrawlAddress, oortBalance);
        IERC20(acceptedPayTokenAddress).transfer(envelopWithdrawlAddress, envelopBalance);
    }

}