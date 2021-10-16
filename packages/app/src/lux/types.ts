import { BigintIsh, Token } from '@luxdefi/sdk'

export type Ask = {
  amount: BigintIsh
  currency: string
  offline: boolean
}

export type Bid = {
  amount: BigintIsh
  currency: string
  bidder: string
  recipient: string
  sellOnShare: { value: number }
  offline: boolean
}

export type CurrencyToken = Token
