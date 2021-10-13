import { Token, Ether } from '../entities'
import { ChainId } from '../enums'
import { USDC_ADDRESS, WETH9_ADDRESS, USDT_ADDRESS } from './addresses'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getCurrencyConstants = (contracts: any) => {
  const MAINNET_WETH = WETH9_ADDRESS[ChainId.MAINNET]
  const MAINNET_USDC = USDC_ADDRESS[ChainId.MAINNET]
  const MAINNET_USDT = USDT_ADDRESS[ChainId.MAINNET]

  const RINKEBY_WETH = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.WETH?.address
  const RINKEBY_USDC = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.USDC?.address
  const RINKEBY_USDT = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.USDT?.address

  const HARDHAT_WETH = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.WETH?.address
  const HARDHAT_USDC = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.USDC?.address
  const HARDHAT_USDT = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.USDT?.address

  return {
    MAINNET_WETH,
    MAINNET_USDC,
    MAINNET_USDT,
    RINKEBY_WETH,
    RINKEBY_USDC,
    RINKEBY_USDT,
    HARDHAT_WETH,
    HARDHAT_USDC,
    HARDHAT_USDT,
  }
}

export const getCurrencyMap = (contracts: any) => {
  const {
    MAINNET_WETH,
    MAINNET_USDC,
    MAINNET_USDT,
    RINKEBY_WETH,
    RINKEBY_USDC,
    RINKEBY_USDT,
    HARDHAT_WETH,
    HARDHAT_USDC,
    HARDHAT_USDT,
  } = getCurrencyConstants(contracts)

  return {
    [ChainId.MAINNET]: {
      [ZERO_ADDRESS]: Ether.onChain(ChainId.MAINNET),
      [MAINNET_WETH]: new Token(ChainId.MAINNET, MAINNET_WETH, 18, 'WETH', 'WETH'),
      [MAINNET_USDC]: new Token(ChainId.MAINNET, MAINNET_USDC, 6, 'USDC', 'USDC'),
      [MAINNET_USDT]: new Token(ChainId.MAINNET, MAINNET_USDT, 6, 'USDT', 'USDT'),
    },
    [ChainId.RINKEBY]: {
      [ZERO_ADDRESS]: Ether.onChain(ChainId.RINKEBY),
      [RINKEBY_WETH]: new Token(ChainId.RINKEBY, RINKEBY_WETH, 18, 'WETH', 'WETH'),
      [RINKEBY_USDC]: new Token(ChainId.RINKEBY, RINKEBY_USDC, 6, 'USDC', 'USDC'),
      [RINKEBY_USDT]: new Token(ChainId.RINKEBY, RINKEBY_USDT, 6, 'USDT', 'USDT'),
    },
    [ChainId.HARDHAT]: {
      [ZERO_ADDRESS]: Ether.onChain(ChainId.HARDHAT),
      [HARDHAT_WETH]: new Token(ChainId.HARDHAT, HARDHAT_WETH, 18, 'WETH', 'WETH'),
      [HARDHAT_USDC]: new Token(ChainId.HARDHAT, HARDHAT_USDC, 6, 'USDC', 'USDC'),
      [HARDHAT_USDT]: new Token(ChainId.HARDHAT, HARDHAT_USDT, 6, 'USDT', 'USDT'),
    },
  }
}

export const getSymbolCurrencyMap = (contracts: any) => {
  const {
    MAINNET_WETH,
    MAINNET_USDC,
    MAINNET_USDT,
    RINKEBY_WETH,
    RINKEBY_USDC,
    RINKEBY_USDT,
    HARDHAT_WETH,
    HARDHAT_USDC,
    HARDHAT_USDT,
  } = getCurrencyConstants(contracts)

  return {
    [ChainId.MAINNET]: {
      ETH: Ether.onChain(ChainId.MAINNET),
      WETH: new Token(ChainId.MAINNET, MAINNET_WETH, 18, 'WETH', 'WETH'),
      USDC: new Token(ChainId.MAINNET, MAINNET_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.MAINNET, MAINNET_USDT, 6, 'USDT', 'USDT'),
    },
    [ChainId.RINKEBY]: {
      ETH: Ether.onChain(ChainId.RINKEBY),
      WETH: new Token(ChainId.RINKEBY, RINKEBY_WETH, 18, 'WETH', 'WETH'),
      USDC: new Token(ChainId.RINKEBY, RINKEBY_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.RINKEBY, RINKEBY_USDT, 6, 'USDT', 'USDT'),
    },
    [ChainId.HARDHAT]: {
      ETH: Ether.onChain(ChainId.HARDHAT),
      WETH: new Token(ChainId.HARDHAT, HARDHAT_WETH, 18, 'WETH', 'WETH'),
      USDC: new Token(ChainId.HARDHAT, HARDHAT_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.HARDHAT, HARDHAT_USDT, 6, 'USDT', 'USDT'),
    },
  }
}
