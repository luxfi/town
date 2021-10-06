import { HardhatUserConfig } from 'hardhat/config'

import fs from 'fs'

const alchemyKey = 'EuD-FVgI2gMBGf0aypDghsPHYWHB9nhn'

function mnemonic() {
  try {
    return fs.readFileSync(`./mnemonic.txt`).toString().trim()
  } catch (e) {
    console.log('☢️  warning: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.')
  }
  return ''
}

//
// Select the network you want to deploy to here:
//
const networks: HardhatUserConfig['networks'] = {
  hardhat: {
    chainId: 1337,
    allowUnlimitedContractSize: true,
    mining: {
      auto: true,
      interval: 5000,
    },
    accounts: {
      mnemonic: mnemonic(),
      count: 20,
      accountsBalance: '10000000000000000000000',
    },
  },
  hardhat2: {
    url: 'http://127.0.0.1:3000',
    chainId: 1338,
    allowUnlimitedContractSize: true,
    mining: {
      auto: true,
      interval: 5000,
    },
    accounts: {
      mnemonic: mnemonic(),
      count: 20,
      accountsBalance: '10000000000000000000000',
    },
  },
  coverage: {
    url: 'http://127.0.0.1:8555',
    blockGasLimit: 200000000,
    allowUnlimitedContractSize: true,
  },
  mainnet: {
    url: 'https://bsc-dataseed.binance.org/',
    chainId: 56,
    accounts: {
      mnemonic: mnemonic(),
    },
  },
  testnet: {
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    chainId: 97,
    gasPrice: 11e9,
    gas: 20e6,
    accounts: {
      mnemonic: mnemonic(),
    },
  },
}

// if (process.env.FORK_ENABLED == "true") {
//   networks.hardhat = {
//     chainId: 1,
//     forking: {
//       url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
//       // blockNumber: 12226812
//     },
//     accounts: {
//       mnemonic,
//     },
//   }
// }  else {
// }

export default networks
