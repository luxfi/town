import { Token } from '@luxdefi/sdk'
import { ZERO_ADDRESS } from '@luxdefi/sdk'
import { Currency, CurrencyAmount } from '@luxdefi/sdk'
import { useEffect, useMemo, useState } from 'react'
import { getCurrencyToken } from '../config/currencies'
import { formatCurrencyAmountWithCommas, numberWithCommas } from '../functions'
import { useActiveWeb3React, useContract } from '../hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { Ask } from './types'

export type AssetState = {
  ask: Ask
  currencyToken: Currency
  currencyBalance: CurrencyAmount<Currency>
  formattedAmount: string
  formattedBalance: string
  isOwner: boolean
  owner: string
  symbol: string
}

export function useAsset(tokenId: number) {
  const { account, chainId } = useActiveWeb3React()
  const [owner, setOwner] = useState(null)
  const [ask, setAsk] = useState(null)
  const [currencyToken, setCurrencyToken] = useState(new Token(chainId, ZERO_ADDRESS, 18))
  const [formattedAmount, setFormattedAmount] = useState(null)
  const [formattedBalance, setFormattedBalance] = useState(null)

  const app = useContract('App')
  const media = useContract('Media')
  const market = useContract('Market')

  const currencyBalance = useCurrencyBalance(account, currencyToken)

  useEffect(() => {
    if (tokenId) {
      media.ownerOf(tokenId).then(setOwner)
      market.currentAskForToken(tokenId).then(setAsk)
    }
  }, [tokenId])

  useEffect(() => {
    if (ask) {
      const token = getCurrencyToken(ask.currency, chainId)
      setCurrencyToken(token)
      setFormattedAmount(formatCurrencyAmountWithCommas(token, ask.amount))
    }
  }, [ask, chainId])

  useEffect(() => {
    if (currencyBalance) {
      setFormattedBalance(numberWithCommas(currencyBalance.toFixed(0)))
    }
  }, [currencyBalance])

  return {
    owner,
    isOwner: account === owner,
    currencyToken,
    currencyBalance,
    formattedAmount,
    formattedBalance,
    balance: currencyBalance?.toFixed(0) || '0',
    symbol: currencyToken && currencyToken.symbol,
    ask,
  }
}
