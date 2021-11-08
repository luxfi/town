import { isNativeCurrency } from '@luxdefi/sdk'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Bid, GraphBid, TokenId } from './types'

export type LazyAcceptBidButtonProps = {
  dropId: TokenId
  name: string
  bidder: string
  onError?: (error) => void
  onAccept?: (dropId: TokenId) => void
}

export const LazyAcceptBidButton = ({ bidder, dropId, name, onAccept, onError }: LazyAcceptBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const market = useContract('Market')
  const [bid, setBid] = useState(null)
  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  useEffect(() => {
    if (dropId && name && bidder) {
      market.lazyBidForTokenBidder(dropId, name, bidder).then((marketBid) => {
        const bid: Bid = {
            amount: marketBid.amount,
            currency: marketBid.currency,
            bidder: marketBid.bidder,
            recipient: marketBid.bidder,
            offline: marketBid.offline,
            sellOnShare: { value: 0 },
        }
        console.log('lazyBidForTokenBidder', bid, dropId, name, bidder)
        setBid(bid)
      })
    }
  }, [dropId, name, bidder])

  const acceptBid = useCallback(async () => {
    if (!bid) {
      return
    }

    try {
      const txSummary = `Accepted Bid for ${name}`

      console.log(ethers.utils.formatEther(bid.amount))

      const tx = await app.acceptLazyBid(dropId, name, bid, { from: account, gasPrice })
      addTransactionPopup(tx, txSummary)

      onAccept && onAccept(dropId)
    } catch (error) {
      addErrorPopup(error)
      onError && onError(error)
    }
  }, [bid, account, dropId, name])

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
