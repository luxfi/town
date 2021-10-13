import { ethers } from 'ethers'
import { ChainId } from '@luxdefi/sdk'
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
}

// Configure game for our Gen 0 drop
export default async function configureGame(network: string, app: any, drop: any, media: any) {
  console.log('NETWORK', network)
  const chainId = CHAIN_IDS[network]

  console.log('Add Drop to App', drop.address)
  await app.addDrop(drop.address)

  console.log('Configure Drop with App', app.address)
  await drop.configure(app.address)

  const ASK_ETH = '0x0000000000000000000000000000000000000000'

  // Add tokenType
  const tokenType = [
    {
      kind: TokenType.VALIDATOR,
      name: 'Validator',
      ask: getAsk(chainId, 'USDC', '10000'),
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
  ].map((t) => ({
    ...t,
    tokenURI: TOKEN_URI[t.kind],
    metadataURI: METADATA_URI[t.kind],
  }))

  for (const t of tokenType) {
    await drop.setTokenType(t.kind, t.name, t.ask, t.supply, t.tokenURI, t.metadataURI)
  }

  await media.setApprovalForAll(app.address, true)

  await app.mintMany(1, 'Validator', 10)
  await app.mintMany(1, 'ATM', 10)
  await app.mintMany(1, 'Wallet', 10)
}
