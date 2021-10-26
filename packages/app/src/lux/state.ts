import { useCallback, useEffect, useState } from 'react'
import { BigintIsh, Currency, CurrencyAmount, CurrencySymbol, Ether, Token, ZERO_ADDRESS, cachedFetch } from '@luxdefi/sdk'
import { useQuery, gql } from '@apollo/client'
import queryString from 'query-string'
import _ from 'lodash'
import { getCurrencyToken, getCurrencyTokenLowerCase } from '../config/currencies'
import { formatCurrencyAmountWithCommas, formatCurrencyFromRawAmount, isSameAddress, numberWithCommas } from '../functions'
import { useActiveWeb3React, useContract } from '../hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { Ask, CoingeckoPrices, HighestBid } from './types'

const symbolMap = {
  [CurrencySymbol.ETH]: 'ethereum',
  [CurrencySymbol.WETH]: 'weth',
}

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
      metadataURI
      createdAtTimestamp
      owner {
        id
      }
      currentAsk {
        amount
        currency {
          id
        }
      }
      currentBids {
        amount
        currency {
          id
        }
        bidder {
          id
        }
      }
    }
  }
`

const defaultAsset = {
  contentURI: null,
  metadataURI: null,
  currentBids: [],
}

export const getContent = (metadataURI) => {
  const match = metadataURI?.match(/type=__(atm|validator|cash|wallet)__/)
  const type = match && match[1] || ''
  // console.log(match)
  const uri = metadataURI ? queryString.parseUrl(metadataURI) : {} as any

  return{
    ...uri.query,
    type: _.upperFirst(type),
    image: type && `/nfts/${type.toLowerCase()}.gif`,
    video: type && `/nfts/${type.toLowerCase()}.mov`,
  }
}

export function useAsset(tokenId: number | string) {
  const { account, chainId } = useActiveWeb3React()
  const [owner, setOwner] = useState(null)
  const [ask, setAsk] = useState(null)
  const [usdAmount, setUsdAmount] = useState(null)
  const [currencyToken, setCurrencyToken] = useState(new Token(chainId, ZERO_ADDRESS, 18) as Currency)
  const [formattedAmount, setFormattedAmount] = useState(null)
  const [formattedBalance, setFormattedBalance] = useState(null)
  const [asset, setAsset] = useState(defaultAsset)
  const { getUsdAmount, prices } = usePrice()
  const { highest } = useBids(tokenId, prices)
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
      setUsdAmount(getUsdAmount(ask.currency, ask.amount))
    }
  }, [ask, chainId])

  useEffect(() => {
    if (currencyBalance) {
      setFormattedBalance(numberWithCommas(currencyBalance.toFixed(0)))
    }
  }, [currencyBalance])

  const { type, video, image } = getContent(asset?.metadataURI)

  return {
    ask,
    owner,
    isOwner: account === owner,
    currencyToken,
    currencyBalance,
    formattedAmount,
    formattedBalance,
    usdAmount,
    balance: currencyBalance?.toFixed(0) || '0',
    symbol: currencyToken && currencyToken.symbol,
    contentURI: asset?.contentURI,
    currentBids: asset?.currentBids,
    type, 
    video,
    image,
    highest,
    getUsdAmount,
  }
}

export const usePrice = () => {
  const coinIds = [
    'ethereum',
    'weth'
  ]
  const COINGECKO_API_V3 = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [prices, setPrices] = useState<CoingeckoPrices>({})

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      const prices = await cachedFetch(COINGECKO_API_V3, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }, 1000 * 60 * 2) // cache for 2 minutes
      setPrices(prices)
      setLoading(false)
    }
    
    fetchPrices()
  }, [])

  const getPrices = (symbol: string) => {
    return prices[symbolMap[symbol]]
  }

  const getUsdPrice = (symbol: string): number => {
    return getPrices(symbol)?.usd || 0
  }

  const getUsdAmount = (tokenAddress: string, tokenAmount: BigintIsh): string => {
    const currencyToken = getCurrencyTokenLowerCase(tokenAddress, chainId) || new Token(chainId, ZERO_ADDRESS, 2)
    const usdPrice = getUsdPrice(currencyToken?.symbol)
    const amount = formatCurrencyFromRawAmount(currencyToken, tokenAmount)
    return usdPrice ? numberWithCommas((parseFloat(amount) * usdPrice).toFixed(0)) : numberWithCommas(amount)
  }

  return {
    loading,
    prices,
    getPrices,
    getUsdAmount,
  }
}

const GET_BIDS = gql`
  query GetBids($where: Bid_filter, $first: Int) {
    bids(where: $where) {
      id
      amount
      createdAtTimestamp
      currency {
        id
      }
      bidder {
        id
      }
      media {
        id
        contentURI
        metadataURI
        owner {
          id
        }
      }
    }
  }
`

export function useBids(tokenId: number | string, prices: CoingeckoPrices) {
  const { account, chainId } = useActiveWeb3React()
  const [bids, setBids] = useState([])
  const { loading, error, refetch } = useQuery(GET_BIDS, {
    variables: {
      where: {
        media: tokenId?.toString(),
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: ({ bids }) => {
      setBids(bids)
    },
  });

  const usdBids = _.orderBy(bids.map((bid) => {
    const currencyToken = getCurrencyTokenLowerCase(bid.currency.id, chainId)
    const usdPrice = prices[symbolMap[currencyToken.symbol]]?.usd
    const amount = formatCurrencyFromRawAmount(currencyToken, bid.amount)
    const usdAmount = parseFloat(amount) * usdPrice
    return {
      bid,
      usdAmount,
      createdAtTimestamp: bid.createdAtTimestamp,
    }
  }), ['usdAmount', 'createdAtTimestamp'], ['asc', 'desc'])

  const highest: HighestBid = usdBids[0]

  return {
    bids,
    usdBids,
    highest,
  }
}

export const useIsAddress = (address2: string) => {
  return ((account: string) => {
    if (!account || !address2) return false
    return isSameAddress(account, address2)
  })
}

export type TokenType = {
  name: string
  kind: number
  minted: number
  supply: number
  timestamp: number
  contentURI: string
  metadataURI: string
}

export const useTokenTypes = () => {
  const [tokenTypes, setTokenTypes] = useState([])
  const [tokenAggregates, setTokenAggregates] = useState({
    minted: 0,
  })
  const drop = useContract('Drop')
  const transformTokenType = (tokenType: any): TokenType => {
    return {
      name: tokenType.name,
      kind: tokenType.kind,
      minted: tokenType.minted.toNumber(),
      supply: tokenType.supply.toNumber(),
      timestamp: tokenType.timestamp.toNumber(),
      contentURI: tokenType.tokenURI,
      metadataURI: tokenType.metadataURI,
    }
  }
  useEffect(() => {
    drop?.getTokenTypes()?.then((tokenTypes) => {
      const transformed: any[] = tokenTypes.map(transformTokenType)
      setTokenTypes(transformed)
      setTokenAggregates({
        minted: _.reduce(transformed.map(({ minted }) => minted), (sum: number, minted) => sum + minted, 0),
      })
    })
  }, [])
  return { tokenTypes, tokenAggregates }
}