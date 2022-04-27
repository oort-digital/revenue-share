import { Assert } from "./network_config";
const { admin } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer: Truffle.Deployer, network: string) {
  const networkConfig = Assert.networkConfigExists(network)
  const { gnosisSafe } = networkConfig
  
  Assert.address(gnosisSafe)

  console.log(`gnosisSafe: ${gnosisSafe}`)
  // transfer upgrade ownership
  await admin.transferProxyAdminOwnership(gnosisSafe);
  
} as Truffle.Migration


// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}