
const truffleConfig = require('../truffle-config')
const zero = '0x0000000000000000000000000000000000000000'

const oortProportion = truffleConfig.oortProportion

interface INetworkConfig {
  payTokenAddr: string
  oortWithdrawlAddr: string
  envelopWithdrawlAddr: string
  gnosisSafe?: string
  isTest: boolean
}

interface ITruffleConfigNetworkMap {
  [id: string]: { migration_config?: INetworkConfig }
}

interface INetworkConfigMap {
  [id: string]: INetworkConfig
}

const truffleConfigNetworks: ITruffleConfigNetworkMap = truffleConfig.networks
const networks: INetworkConfigMap = {}

Object.entries(truffleConfigNetworks)
  .filter(keyVal => keyVal[1].migration_config)
  .forEach(keyVal => {
    const netName = keyVal[0]
    const netConfig: INetworkConfig = keyVal[1].migration_config!
    networks[netName] = netConfig
  });

class Assert {

  static testNetwork = (network: string) => {
    const networkConfig = networks[network]
  
    if(!networkConfig.isTest) {
      throw new Error(`Expected test network. See network_config.ts`)
    }
  
  }
  
  static networkConfigExists(network: string): INetworkConfig {
    const networkConfig = networks[network]
  
    if(!networkConfig) {
      throw new Error(`No network config for '${network}' network. See network_config.ts`)
    }

    return networkConfig
  }

  static address(address: string | undefined) {
    if(!address) {
      throw new Error('Invalid address')
    }

    if(address === zero) {
      throw new Error('Zero address')
    }
  }
}

const devNetName = 'development'

const isDevNet = (network: string) => network === devNetName

export { zero, networks, Assert, isDevNet, devNetName, oortProportion }