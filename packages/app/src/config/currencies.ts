import { ChainId, Currency, getCurrencyMap } from '@luxdefi/sdk'
import contracts from '../contracts.json'

export const getCurrency = (addr: string, chainId: ChainId): Currency => {
  const map = getCurrencyMap(contracts)
  return map[chainId][addr]
}
