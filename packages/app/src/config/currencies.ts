import { ChainId, Currency, getCurrencyMap, getSymbolCurrency, CurrencySymbol, Token } from '@luxdefi/sdk'
import contractsJson from '../contracts.json'
import { CurrencyToken } from '../lux/types'

export const contracts = contractsJson

export const SUPPORTED_PAYMENT_CURRENCIES = [
  CurrencySymbol.ETH,
  CurrencySymbol.USDC,
  CurrencySymbol.USDT,
  CurrencySymbol.WETH,
]

export const getCurrencyToken = (tokenAddress: string, chainId: ChainId): Currency | Token => {
  const map = getCurrencyMap(contractsJson)
  return map[chainId][tokenAddress]
}

export const getCurrencyTokenLowerCase = (tokenAddress: string, chainId: ChainId): Currency | Token => {
  const map = getCurrencyMap(contractsJson)
  const lowercaseMap = {}
  for (const address of Object.keys(map[chainId])) {
    lowercaseMap[address.toLowerCase()] = map[chainId][address]
  }
  return lowercaseMap[tokenAddress.toLowerCase()]
}

export const getSupportedPaymentCurrencies = (chainId: ChainId): Currency[] => {
  return SUPPORTED_PAYMENT_CURRENCIES.map((symbol) => getSymbolCurrency(contractsJson, chainId, symbol))
}
