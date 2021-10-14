import { ChainId } from '@luxdefi/sdk'
import { BigNumberish } from '@ethersproject/bignumber'
import { getAsk } from './ask'

enum TokenType {
  VALIDATOR = 0,
  ATM = 1,
  WALLET = 2,
  CASH = 3,
}

const TOKEN_URI = {
  [TokenType.VALIDATOR]: 'https://lux.town/nfts/validator.mp4',
  [TokenType.ATM]: 'https://lux.town/nfts/atm.mp4',
  [TokenType.WALLET]: 'https://lux.town/nfts/wallet.mp4',
  [TokenType.CASH]: 'https://lux.town/nfts/cash.mp4',
}

const METADATA_URI = {
  [TokenType.VALIDATOR]: 'https://lux.town/nfts/validator.mp4',
  [TokenType.ATM]: 'https://lux.town/nfts/atm.mp4',
  [TokenType.WALLET]: 'https://lux.town/nfts/wallet.mp4',
  [TokenType.CASH]: 'https://lux.town/nfts/cash.mp4',
}

const CHAIN_IDS = {
  mainnet: ChainId.MAINNET,
  testnet: ChainId.RINKEBY,
  hardhat: ChainId.HARDHAT,
  localhost: ChainId.HARDHAT,
}

type TokenTypeInput = {
  kind: number
  name: string
  supply: number
  ask: {
    currency: string
    amount: BigNumberish
    offline: boolean
  }
}

const getTokenTypes = (network: string, mainnetTokenTypes: TokenTypeInput[], testTokenTypes: TokenTypeInput[]) => {
  return (network === 'mainnet' ? mainnetTokenTypes : testTokenTypes).map((t) => ({
    ...t,
    tokenURI: TOKEN_URI[t.kind],
    metadataURI: METADATA_URI[t.kind],
  }))
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
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 18000,
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 18000,
    },
  ]

  // Add tokenType
  const testTokenTypes = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'ETH', '290'),
      supply: 10,
    },
    {
      kind: TokenType.ATM,
      name: 'ATM',
      ask: getAsk(chainId, 'WETH', '135'),
      supply: 10,
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet',
      ask: getAsk(chainId, 'USDC', '20000'),
      supply: 10,
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet_USDT',
      ask: getAsk(chainId, 'USDT', '30000'),
      supply: 10,
    },
    {
      kind: TokenType.WALLET,
      name: 'Wallet_Offline',
      ask: getAsk(chainId, 'USDC', '40000', true),
      supply: 10,
    },
  ]

  const tokenTypes = getTokenTypes(network, mainnetTokenTypes, testTokenTypes)

  for (const t of tokenTypes) {
    await drop.setTokenType(t.kind, t.name, t.ask, t.supply, t.tokenURI, t.metadataURI)
  }

  console.log('Minting...')
  for (const t of tokenTypes) {
    for (const quantity of chunkQuantity(t.supply, 100)) {
      console.log(`App.mintMany(1, ${t.name}, ${quantity})`)
      const tx = await app.mintMany(1, t.name, quantity)
      await tx.wait()
    }
  }
  console.log('Done')
}
