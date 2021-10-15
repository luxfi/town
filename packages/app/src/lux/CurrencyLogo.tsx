import Image from 'next/image'
import { CURRENCY_SYMBOL_LOGO, CurrencySymbol } from '@luxdefi/sdk'

export type CurrencyLogoProps = {
  symbol: CurrencySymbol
  size?: number
  className?: string
}

const CurrencyLogo = ({ symbol, size = 32, className }: CurrencyLogoProps) => {
  const logo = CURRENCY_SYMBOL_LOGO[symbol]
  return (
    <>
      {logo && (
        <Image
          src={logo}
          alt={`Select ${symbol} currency`}
          className={`rounded-full ${className || ''}`}
          width={`${size}px`}
          height={`${size}px`}
        />
      )}
    </>
  )
}

export default CurrencyLogo
