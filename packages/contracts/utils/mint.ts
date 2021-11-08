import { ChainId } from '@luxdefi/sdk'
import { BigNumberish } from '@ethersproject/bignumber'
import { getAsk } from './ask'
import queryString from 'query-string'
import _ from 'lodash'

enum TokenType {
  VALIDATOR = 0,
  ATM = 1,
  WALLET = 2,
  CASH = 3,
}

const TOKEN_TYPES = {
  [TokenType.VALIDATOR]: 'validator',
  [TokenType.ATM]: 'atm',
  [TokenType.CASH]: 'cash',
  [TokenType.WALLET]: 'wallet',
}

const TOKEN_URI = {
  [TokenType.VALIDATOR]: 'https://lux.town/nfts/validator.mov',
  [TokenType.ATM]: 'https://lux.town/nfts/atm.mov',
  [TokenType.WALLET]: 'https://lux.town/nfts/wallet.mov',
  [TokenType.CASH]: 'https://lux.town/nfts/cash.mov',
}

const METADATA_URI = {
  [TokenType.VALIDATOR]: 'https://lux.town/api/metadata/validator.json',
  [TokenType.ATM]: 'https://lux.town/api/metadata/atm.json',
  [TokenType.WALLET]: 'https://lux.town/api/metadata/wallet.json',
  [TokenType.CASH]: 'https://lux.town/api/metadata/cash.json',
}

const CHAIN_IDS = {
  mainnet: ChainId.MAINNET,
  testnet: ChainId.ROPSTEN,
  hardhat: ChainId.HARDHAT,
  localhost: ChainId.HARDHAT,
}

type QueryString = {
  [key: string]: string | number 
}

type TokenTypeInput = {
  kind: number
  name: string
  supply: number
  queryString: QueryString,
  ask: {
    currency: string
    amount: BigNumberish
    offline: boolean
  }
}

const MILLION = 1000000

const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms))
}

const getTokenTypes = (network: string, mainnetTokenTypes: TokenTypeInput[], testTokenTypes: TokenTypeInput[]) => {
  return (network === 'mainnet' ? mainnetTokenTypes : testTokenTypes).map((t) => {
    const q = {
      name: `__${_.snakeCase(t.name)}__`,
      type: `__${TOKEN_TYPES[t.kind]}__`,
      ...t.queryString
    }
    return {
      ...t,
      tokenURI: `${TOKEN_URI[t.kind]}?${queryString.stringify(q)}`,
      metadataURI: `${METADATA_URI[t.kind]}?${queryString.stringify(q)}`,
    }
  })
}

const chunkQuantity = (number: number, n: number) => {
  var chunks: number[] = Array(Math.floor(number / n)).fill(n)
  var remainder = number % n

  if (remainder > 0) {
    chunks.push(remainder)
  }
  return chunks
}

// Configure game for our Gen 0 drop
export default async function mint(app: any, drop: any, network: string = 'hardhat') {
  const chainId = CHAIN_IDS[network]

  console.log({ network, chainId })

  const LUX_USD = 0.0021

  // Validator 100
  // Wallet
  // - 10B Lux x 1
  // - 1B Lux x 10
  // - 100M Lux x 100
  // - 10M Lux x1000
  // - 1M Lux x10000
  // ATM 1000

  const mainnetTokenTypes = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 100,
      queryString: {}
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 10B Lux',
      ask: getAsk(chainId, 'USDT', `${LUX_USD * 10000000000000}`),
      supply: 1,
      queryString: {
        lux: 10000000000000,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 1B Lux',
      ask: getAsk(chainId, 'USDT', `${LUX_USD * 1000000000000}`),
      supply: 10,
      queryString: {
        lux: 1000 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 100M Lux',
      ask: getAsk(chainId, 'USDT', `${LUX_USD * 100000000}`),
      supply: 100,
      queryString: {
        lux: 100 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 10M Lux',
      ask: getAsk(chainId, 'USDT', `${LUX_USD * 10000000}`),
      supply: 1000,
      queryString: {
        lux: 10 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 1M Lux',
      ask: getAsk(chainId, 'USDT', `${LUX_USD * 1000000}`),
      supply: 10000,
      queryString: {
        lux: MILLION,
      }
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 1000,
      queryString: {}
    },
  ]

  // Add tokenType
  const testTokenTypes = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 100,
      queryString: {}
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 10B Lux',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 1,
      queryString: {
        lux: 10000000000000,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 1B Lux',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 10,
      queryString: {
        lux: 1000 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 100M Lux',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 100,
      queryString: {
        lux: 100 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 10M Lux',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 1000,
      queryString: {
        lux: 10 * MILLION,
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 1M Lux',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 10000,
      queryString: {
        lux: MILLION,
      }
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'USDT', `${MILLION}`),
      supply: 1000,
      queryString: {}
    },
  ]

  const tokenTypes = getTokenTypes(network, mainnetTokenTypes, testTokenTypes)

  for (const t of tokenTypes) {

    const existingTokenType = await drop.getTokenType(t.name)

    if (!existingTokenType.name) {
      console.log('Drop.setTokenType', t.kind, t.name, t.ask, t.supply, t.tokenURI, t.metadataURI)
      const tx = await drop.setTokenType(t.kind, t.name, t.ask, t.supply, t.tokenURI, t.metadataURI)
      await tx.wait()
    }
  }


  const configuredTypes = await drop.getTokenTypes()

  if (configuredTypes.length > 0) {
    console.log('Drop: Token types')
    configuredTypes.forEach((configureType) => {
      console.log(`- ${configureType.name}`)
    })
  }

  console.log('Minting...')

  // for (const configuredType of configuredTypes) {

  //   const name = configuredType.name
  //   const minted = configuredType.minted.toNumber()
  //   const supply = configuredType.supply.toNumber()
  //   const remaining = supply - minted
  //   let currentMinted = minted

  //   console.log(name, {
  //     minted,
  //     supply,
  //     remaining,
  //   })

  //   for (const quantity of chunkQuantity(remaining, 7)) {
  //     if (quantity > 0 && currentMinted < 30) {
  //       console.log(`App.mintMany(1, ${name}, ${quantity})`)
  //       const tx = await app.mintMany(1, name, quantity)
  //       await tx.wait()
  //       currentMinted = currentMinted + quantity
  //       console.log(`Currently minted ${name}`, currentMinted)
  //       if (network !== 'hardhat') {
  //         console.log('Wait 1 minute')
  //         await wait(60000)
  //       }
  //     }
  //   }
  // }

  console.log('Done')
}
