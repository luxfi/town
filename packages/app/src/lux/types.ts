import { BigintIsh, Token } from '@luxdefi/sdk'
import { BigNumber } from 'ethers'

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

export type CurrencyToken = Token


// GraphQL Response Types

export type UserResponse = {
  id: string
}

export type CurrencyReponse = {
  id: string
}

export type BidResponse = {
  id: string
  amount: BigintIsh
  currency: CurrencyReponse
  bidder: UserResponse
  recipient: UserResponse
}
