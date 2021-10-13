import { ChainId, Token, getSymbolCurrencyMap } from '@luxdefi/sdk'
import { ethers } from 'hardhat'
import contracts from '../contracts.json'

export const getSymbolCurrency = (chainId: ChainId, symbol: string): Token => {
  const map = getSymbolCurrencyMap(contracts)
  return map[chainId][symbol]
}

export const getAsk = (chainId: ChainId, symbol: string, amount: string) => {
  const currency: Token = getSymbolCurrency(chainId, symbol)
  return {
    currency: currency.address,
    amount: ethers.utils.parseUnits(amount, currency.decimals),
  }
}
