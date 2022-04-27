
const HDWalletProvider = require('@truffle/hdwallet-provider');

function createHDWalletProvider(providerOrUrl, chainId) {
  const { mnemonic } = require('./secrets.json');
  return new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic
    },
    providerOrUrl:  providerOrUrl,
    chainId: chainId
  })
}

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  oortProportion: 80,

  networks: {
    development: {
      host: '127.0.0.1',     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: '*',       // Any network (default: none)
      migration_config: {
        payTokenAddr:      "0x0000000000000000000000000000000000000001",
        oortWithdrawlAddr: "0x0000000000000000000000000000000000000002",
        envelopWithdrawlAddr: "0x0000000000000000000000000000000000000003",
        gnosisSafe: "0x303C01ADf7C086CDc11d24Edc61058975bcF910C",
        isTest: true
       }
    },


    matic: {
/*
if some errors, try to switch RPCs:
https://rpc-mainnet.matic.network
https://rpc-mainnet.maticvigil.com
https://rpc-mainnet.matic.quiknode.pro
https://matic-mainnet.chainstacklabs.com
https://matic-mainnet-full-rpc.bwarelabs.com
https://matic-mainnet-archive-rpc.bwarelabs.com
*/
      provider: () => createHDWalletProvider("https://rpc-mainnet.maticvigil.com", 137),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 30000,
      gasPrice: 49000000000,
      skipDryRun: true,
      networkCheckTimeout:100000,
      migration_config: {
        payTokenAddr:      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        oortWithdrawlAddr: "0x69d1fbEF560978B033c00faE1A3660D397Ce78a2",
        envelopWithdrawlAddr: "0x4AC9aB28957aA70d5f28e6e4918bf12D9558B87C",
        gnosisSafe: "0x69d1fbEF560978B033c00faE1A3660D397Ce78a2"
      }
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
