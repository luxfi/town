import { Currency, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import { useEffect, useState } from 'react'
import { getCurrencyTokenLowerCase } from '../config/currencies'
import { formatCurrencyAmountWithCommas, shortenAddress } from '../functions'
import { useActiveWeb3React } from '../hooks'
import { usePrice } from './state'
import { BidResponse } from './types'

const Bid = (bid: BidResponse) => {
  const { chainId } = useActiveWeb3React()
  const { getUsdAmount } = usePrice()
  const [formattedAmount, setFormattedAmount] = useState(null)
  const [currencyToken, setCurrencyToken] = useState(new Token(chainId, ZERO_ADDRESS, 18) as Currency)

  useEffect(() => {
    const token = getCurrencyTokenLowerCase(bid.currency.id, chainId)
    if (token) {
      setCurrencyToken(token)
      setFormattedAmount(formatCurrencyAmountWithCommas(token, bid.amount))
    }
  }, [chainId])

  const usdAmount = getUsdAmount(bid.currency.id, bid.amount)

  return (
    <div className="grid grid-cols-2 my-3 Bid">
      <div className="">
        <div>{shortenAddress(bid?.bidder?.id)} Placed a bid</div>
        {/* <small>30 mins ago</small> */}
      </div>
      <div className="text-right">
        <div>{formattedAmount} {currencyToken?.symbol}</div>
        {usdAmount !== '0' && (<small className="text-gray-500">${usdAmount}</small>)}
      </div>
    </div>
  )
}

export default Bid
