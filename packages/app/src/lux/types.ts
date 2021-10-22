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

export type UserResponse = {
  id: string
}

export type CurrencyReponse = {
  id: string
}

export type MediaReponse = {
  id: string
  contentURI: string
  owner: UserResponse
}

export type BidResponse = {
  id: string
  amount: BigintIsh
  currency: CurrencyReponse
  bidder: UserResponse
  recipient: UserResponse
  media: MediaReponse
  createdAtTimestamp: string
}

// Example
// {
//   ethereum: {
//     usd: 3650.52
//   }
//   weth: {
//     usd: 3640.05
//   }
// }
export type CoingeckoPrices = {
  [coinId: string]: {
    usd: number
  }
}

export type HighestBid = {
  bid: BidResponse
  usdAmount: number
  createdAtTimestamp: string
}