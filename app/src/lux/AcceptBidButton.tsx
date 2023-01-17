import { isNativeCurrency } from '@luxdefi/sdk'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Bid, GraphBid, TokenId } from './types'

export type AcceptBidButtonProps = {
  tokenId: TokenId
  tokenType: string
  bidder: string
  onError?: (error) => void
  onAccept?: (tokenId: TokenId) => void
}

export const AcceptBidButton = ({ bidder, tokenId, tokenType, onAccept, onError }: AcceptBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const media = useContract('Media')
  const market = useContract('Market')
  const [bid, setBid] = useState(null)
  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  useEffect(() => {
    if (tokenId) {
      market.bidForTokenBidder(tokenId, bidder).then((marketBid) => {
        const bid: Bid = {
            amount: marketBid.amount,
            currency: marketBid.currency,
            bidder: marketBid.bidder,
            recipient: marketBid.bidder,
            offline: marketBid.offline,
            sellOnShare: { value: 0 },
        }
        setBid(bid)
      })
    }
  }, [tokenId, bidder])

  const acceptBid = useCallback(async () => {
    if (!bid) {
      return
    }

    try {
      const txSummary = `Accepted Bid for ${tokenType} ${tokenId}`

      console.log(ethers.utils.formatEther(bid.amount))

      if (isNativeCurrency(bid.currency)) {
        const tx = await app.acceptBid(tokenId, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      } else {
        const tx = await media.acceptBid(tokenId, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      }

      onAccept && onAccept(tokenId)
    } catch (error) {
      addErrorPopup(error)
      onError && onError(error)
    }
  }, [bid, app, media, account, tokenId])

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
