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
  testnet: ChainId.RINKEBY,
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

const getTokenTypes = (network: string, mainnetTokenTypes: TokenTypeInput[], testTokenTypes: TokenTypeInput[]) => {
  return (network === 'mainnet' ? mainnetTokenTypes : testTokenTypes).map((t) => {
    const q = {
      name: `__${_.snakeCase(t.name)}__`,
      kind: `__${t.kind}__`,
      supply: t.supply,
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

  const mainnetTokenTypes = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 18000,
      queryString: {}
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 18000,
      queryString: {}
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 18000,
      queryString: {}
    },
  ]

  // Add tokenType
  const testTokenTypes = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 14,
      queryString: {}
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'WETH', '135'),
      supply: 14,
      queryString: {}
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 1,000,000 Lux',
      ask: getAsk(chainId, 'USDC', '20000'),
      supply: 14,
      queryString: {
        lux: 1000000
      }
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet 30,000 Lux',
      ask: getAsk(chainId, 'USDT', '30000'),
      supply: 14,
      queryString: {
        lux: 30000,
      }
    },
  ]

  const tokenTypes = getTokenTypes(network, mainnetTokenTypes, testTokenTypes)

  for (const t of tokenTypes) {
    await drop.setTokenType(t.kind, t.name, t.ask, t.supply, t.tokenURI, t.metadataURI)
  }

  console.log('Minting...')
  for (const t of tokenTypes) {
    for (const quantity of chunkQuantity(t.supply, 25)) {
      console.log(`App.mintMany(1, ${t.name}, ${quantity})`)
      const tx = await app.mintMany(1, t.name, quantity)
      await tx.wait()
    }
  }
  console.log('Done')
}
