import { Assert } from "./network_config";
const RevenueShareContract = artifacts.require("RevenueShare");

module.exports = async function (deployer: Truffle.Deployer, network: string) {
  const networkConfig = Assert.networkConfigExists(network)
  const { gnosisSafe } = networkConfig
  
  Assert.address(gnosisSafe)
  console.log(`gnosisSafe: ${gnosisSafe}`)
  
  const instance = await RevenueShareContract.deployed()

  // transfer ownership to call "onlyOwner" methods
  await instance.transferOwnership(gnosisSafe!)

} as Truffle.Migration


// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}