import { isNativeCurrency } from '@luxdefi/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Bid, BidResponse } from './types'

export type AcceptBidButtonProps = {
  tokenId: number
  tokenType: string
  bid: BidResponse
  currency: string
  onError?: (error) => void
}

export const AcceptBidButton = ({ bid: bidResponse, tokenId, tokenType, currency, onError }: AcceptBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const media = useContract('Media')
  const market = useContract('Market')
  const [bid, setBid] = useState(null)
  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()
  const bidder = bidResponse?.bidder?.id

  useEffect(() => {
    if (tokenId) {
      market.bidForTokenBidder(tokenId, bidder).then((marketBid) => {
        const bid: Bid = {
            amount: marketBid.amount,
            currency: marketBid.currency,
            bidder: marketBid.bidder,
            recipient: marketBid.bidder,
            sellOnShare: { value: 0 },
            offline: marketBid.offline,
        }
        setBid(bid)
      })
    }
  }, [tokenId, bidder])

  const acceptBid = useCallback(async () => {
    if (!bid) {
      return
    }

    console.log(bid)

    try {
      const txSummary = `Accepted Bid for ${tokenType} ${tokenId}`

      if (isNativeCurrency(currency)) {
        const tx = await app.acceptBid(tokenId, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      } else {
        const tx = await media.acceptBid(tokenId, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      }
    } catch (error) {
      addErrorPopup(error)
      onError && onError(error)
    }
  }, [bid, app, media, account, tokenId, currency])

  return (
    <button
      type="button"
      className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
      onClick={acceptBid}
    >
      Accept Bid
    </button>
  )
}
