import { Currency, BigintIsh, Token } from '@luxdefi/sdk'
import { BigNumber } from 'ethers'

export type TokenId = string | number

export type Ask = {
  amount: BigintIsh | BigNumber
  currency: string
  offline: boolean
}

export type Bid = {
  amount: BigintIsh | BigNumber
  currency: string
  bidder: string
  recipient: string
  sellOnShare: { value: number }
  offline: boolean
}

// GraphQL Response Types

export type GraphUser = {
  id: string
}

export type GraphCurrency = {
  id: string
}

export type GraphMedia = {
  id: string
  contentURI: string
  owner: GraphUser
}

export type GraphAsk = {
  id: string
  amount: BigintIsh
  owner: GraphUser
  currency: GraphCurrency
  media: GraphMedia
  createdAtTimestamp: string
}

export type GraphBid = {
  id: string
  amount: BigintIsh
  currency: GraphCurrency
  bidder: GraphUser
  recipient: GraphUser
  media: GraphMedia
  createdAtTimestamp: string
}

export type CoingeckoPrices = {
  [coinId: string]: {
    usd: number
  }
}

export type HighestBid = {
  bid: GraphBid
  usdAmount: number
  createdAtTimestamp: string
}