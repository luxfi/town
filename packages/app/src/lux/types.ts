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
