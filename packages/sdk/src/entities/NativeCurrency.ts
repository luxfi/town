import { AbstractCurrency } from './AbstractCurrency'

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends AbstractCurrency {
  public readonly isNative: true = true
  public readonly isToken: false = false
  public readonly address: string = '0x0000000000000000000000000000000000000000'
}
