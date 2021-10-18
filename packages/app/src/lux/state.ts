import { Token } from '@luxdefi/sdk'
import { ZERO_ADDRESS } from '@luxdefi/sdk'
import { Currency, CurrencyAmount } from '@luxdefi/sdk'
import { useEffect, useMemo, useState } from 'react'
import { getCurrencyToken } from '../config/currencies'
import { formatCurrencyAmountWithCommas, numberWithCommas } from '../functions'
import { useActiveWeb3React, useContract } from '../hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { Ask } from './types'
import { useQuery, gql } from '@apollo/client'

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

export type UseAssetOptions = {
  isActive?: boolean
}

const GET_ASSET = gql`
  query GetAsset($id: Int!) {
    media(id:$id) {
      id
      contentURI
      createdAtTimestamp
      owner {
        id 
      }
      currentAsk {
        currency {
          id
        }
        amount
      }
      currentBids {
        amount
    }
    }
  }
`

const defaultAsset = {
  contentURI: null,
  currentBids: [],
}

export function useAsset(tokenId: number | string) {
  const { account, chainId } = useActiveWeb3React()
  const [owner, setOwner] = useState(null)
  const [ask, setAsk] = useState(null)
  const [currencyToken, setCurrencyToken] = useState(new Token(chainId, ZERO_ADDRESS, 18) as Currency)
  const [formattedAmount, setFormattedAmount] = useState(null)
  const [formattedBalance, setFormattedBalance] = useState(null)
  const [asset, setAsset] = useState(defaultAsset)

  const { loading, error } = useQuery(GET_ASSET, {
    variables: {
      id: tokenId ? parseInt(tokenId.toString()) : 0,
    },
    onCompleted: ({ media }) => {
      setAsset(media || defaultAsset)
    }
  });

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

  console.log(media.contentURI)

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
    contentURI: asset?.contentURI,
    currentBids: asset?.currentBids,
  }
}
