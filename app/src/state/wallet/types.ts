import { CurrencyAmount, Token } from '@luxdefi/sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>
