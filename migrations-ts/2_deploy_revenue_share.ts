import { Assert, oortProportion } from "./network_config"
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const revenueShare = artifacts.require("RevenueShare");

module.exports = async function (deployer: Truffle.Deployer, network: string) {

  console.log('deploy_revenue_share')
  const networkConfig = Assert.networkConfigExists(network)
  const { payTokenAddr, oortWithdrawlAddr, envelopWithdrawlAddr } = networkConfig

  //erc20.address, oortWithdrawlAddress, envelopWithdrawlAddress, oortProportion
  Assert.address(payTokenAddr)
  Assert.address(oortWithdrawlAddr)
  Assert.address(oortWithdrawlAddr)

  await deployProxy(revenueShare, [payTokenAddr, oortWithdrawlAddr, envelopWithdrawlAddr, oortProportion], { deployer });

} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}