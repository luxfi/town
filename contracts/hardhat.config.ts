import { HardhatUserConfig } from 'hardhat/types'
import 'hardhat-deploy'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-web3'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan"
import '@openzeppelin/hardhat-upgrades'

require('dotenv').config()

import networks from './hardhat.network'

const config: HardhatUserConfig = {
  networks,

  solidity: {
    compilers: [
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 20,
          },
        },
      },
    ],
  },

  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    dao: {
      default: 1,
    },
  },

  paths: {
    sources: './src',
  },

  typechain: {
    outDir: './types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    externalArtifacts: [],
  },

  mocha: {
    timeout: 20000000,
    // parallel: true,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export {}

export default config