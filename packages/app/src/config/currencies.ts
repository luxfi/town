import { ChainId, Currency, Ether, Token, USDC_ADDRESS } from '@luxdefi/sdk'
import contracts from '../contracts.json'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const HARDHAT_WETH = contracts[ChainId.HARDHAT.toString()].localhost.contracts.WETH
const HARDHAT_USDC = contracts[ChainId.HARDHAT.toString()].localhost.contracts.USDC
const HARDHAT_USDT = contracts[ChainId.HARDHAT.toString()].localhost.contracts.USDT

export const CURRENCIES = {
  [ChainId.MAINNET]: {
    [ZERO_ADDRESS]: Ether.onChain(ChainId.MAINNET),
  },
  [ChainId.RINKEBY]: {
    [ZERO_ADDRESS]: Ether.onChain(ChainId.RINKEBY),
  },
  [ChainId.HARDHAT]: {
    [ZERO_ADDRESS]: Ether.onChain(ChainId.HARDHAT),
    [HARDHAT_WETH.address]: Ether.onChain(ChainId.HARDHAT),
    [HARDHAT_USDC.address]: new Token(ChainId.HARDHAT, HARDHAT_USDC.address, 6, 'USDC', 'USDC'),
    [HARDHAT_USDT.address]: new Token(ChainId.HARDHAT, HARDHAT_USDT.address, 6, 'USDT', 'USDT'),
  },
}

export const currencyMap = (addr: string, chainId: ChainId): Currency => {
  return CURRENCIES[chainId][addr]
}
