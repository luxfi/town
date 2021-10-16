import { Token, Ether } from '../entities'
import { ChainId } from '../enums'
import { USDC_ADDRESS, WETH9_ADDRESS, USDT_ADDRESS } from './addresses'

export enum CurrencySymbol {
  DAI = 'DAI',
  ETH = 'ETH',
  WETH = 'WETH',
  USDC = 'USDC',
  USDT = 'USDT',
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const UNDEPLOYED_ADDRESS = ZERO_ADDRESS

// export const AvalancheLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/avax.jpg'
// export const BinanceCoinLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/bnb.jpg'
export const EthLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg'
export const WethLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/weth.jpg'
export const UsdcLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg'
export const UsdtLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdt.jpg'
export const DaiLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg'
// export const xDaiLogo =
//   'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/xdai/assets/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/logo.svg'
// export const FantomLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/ftm.jpg'
// export const HarmonyLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg'
// export const HecoLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/heco.jpg'
// export const MaticLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg'
// export const MoonbeamLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg'
// export const OKExLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/okt.jpg'
// export const CeloLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/celo.jpg'
// export const PalmLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/palm.jpg'
// export const MovrLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/movr.jpg'

export const CURRENCY_SYMBOL_LOGO = {
  [CurrencySymbol.DAI]: DaiLogo,
  [CurrencySymbol.ETH]: EthLogo,
  [CurrencySymbol.WETH]: WethLogo,
  [CurrencySymbol.USDC]: UsdcLogo,
  [CurrencySymbol.USDT]: UsdtLogo,
}

export const getCurrencyConstants = (contracts: any) => {
  const MAINNET_WETH = WETH9_ADDRESS[ChainId.MAINNET]
  const MAINNET_USDC = USDC_ADDRESS[ChainId.MAINNET]
  const MAINNET_USDT = USDT_ADDRESS[ChainId.MAINNET]

  const RINKEBY_WETH = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.WETH?.address || UNDEPLOYED_ADDRESS
  const RINKEBY_USDC = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.USDC?.address || UNDEPLOYED_ADDRESS
  const RINKEBY_USDT = contracts[ChainId.RINKEBY.toString()]?.testnet?.contracts?.USDT?.address || UNDEPLOYED_ADDRESS

  const HARDHAT_WETH = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.WETH?.address || UNDEPLOYED_ADDRESS
  const HARDHAT_USDC = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.USDC?.address || UNDEPLOYED_ADDRESS
  const HARDHAT_USDT = contracts[ChainId.HARDHAT.toString()]?.hardhat?.contracts?.USDT?.address || UNDEPLOYED_ADDRESS

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
      [MAINNET_USDC]: new Token(ChainId.MAINNET, MAINNET_USDC, 6, 'USDC', 'USDC'),
      [MAINNET_USDT]: new Token(ChainId.MAINNET, MAINNET_USDT, 6, 'USDT', 'USDT'),
      [MAINNET_WETH]: new Token(ChainId.MAINNET, MAINNET_WETH, 18, 'WETH', 'WETH'),
    },
    [ChainId.RINKEBY]: {
      [ZERO_ADDRESS]: Ether.onChain(ChainId.RINKEBY),
      [RINKEBY_USDC]: new Token(ChainId.RINKEBY, RINKEBY_USDC, 6, 'USDC', 'USDC'),
      [RINKEBY_USDT]: new Token(ChainId.RINKEBY, RINKEBY_USDT, 6, 'USDT', 'USDT'),
      [RINKEBY_WETH]: new Token(ChainId.RINKEBY, RINKEBY_WETH, 18, 'WETH', 'WETH'),
    },
    [ChainId.HARDHAT]: {
      [ZERO_ADDRESS]: Ether.onChain(ChainId.HARDHAT),
      [HARDHAT_USDC]: new Token(ChainId.HARDHAT, HARDHAT_USDC, 6, 'USDC', 'USDC'),
      [HARDHAT_USDT]: new Token(ChainId.HARDHAT, HARDHAT_USDT, 6, 'USDT', 'USDT'),
      [HARDHAT_WETH]: new Token(ChainId.HARDHAT, HARDHAT_WETH, 18, 'WETH', 'WETH'),
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
      USDC: new Token(ChainId.MAINNET, MAINNET_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.MAINNET, MAINNET_USDT, 6, 'USDT', 'USDT'),
      WETH: new Token(ChainId.MAINNET, MAINNET_WETH, 18, 'WETH', 'WETH'),
    },
    [ChainId.RINKEBY]: {
      ETH: Ether.onChain(ChainId.RINKEBY),
      USDC: new Token(ChainId.RINKEBY, RINKEBY_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.RINKEBY, RINKEBY_USDT, 6, 'USDT', 'USDT'),
      WETH: new Token(ChainId.RINKEBY, RINKEBY_WETH, 18, 'WETH', 'WETH'),
    },
    [ChainId.HARDHAT]: {
      ETH: Ether.onChain(ChainId.HARDHAT),
      USDC: new Token(ChainId.HARDHAT, HARDHAT_USDC, 6, 'USDC', 'USDC'),
      USDT: new Token(ChainId.HARDHAT, HARDHAT_USDT, 6, 'USDT', 'USDT'),
      WETH: new Token(ChainId.HARDHAT, HARDHAT_WETH, 18, 'WETH', 'WETH'),
    },
  }
}

export const getSymbolCurrency = (contracts: any, chainId: ChainId, symbol: CurrencySymbol) => {
  const map: any = getSymbolCurrencyMap(contracts)
  const tokensBySymbol = map[chainId]
  return tokensBySymbol[symbol]
}
