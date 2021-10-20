import { Currency, isNativeCurrency } from '@luxdefi/sdk'
import { useCallback } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Ask, Bid } from './types'

export type SetBidButtonProps = {
  ask: Ask
  tokenId: number
  tokenType: string
  amount: number | string
  currencyToken: Currency
}

export const SetBidButton = ({
  ask,
  tokenId,
  tokenType,
  amount,
  currencyToken,
}: SetBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const media = useContract('Media')

  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  const setBid = useCallback(async () => {
    if (!amount) {
      // @todo - amount required message
    }

    try {
      const bid: Bid = {
        amount: ask.amount,
        currency: currencyToken.address,
        bidder: account,
        recipient: account,
        sellOnShare: { value: 0 },
        offline: ask.offline,
      }

      const txSummary = `Placed Bid for ${tokenType} ${tokenId}`

      if (isNativeCurrency(currencyToken.address)) {
        const tx = await app.setBid(tokenId, bid, { from: account, gasPrice, value: bid.amount })
        addTransactionPopup(tx, txSummary)
      } else {
        const tx = await media.setBid(tokenId, bid, { from: account, gasPrice, value: bid.amount })
        addTransactionPopup(tx, txSummary)
      }
    } catch (error) {
      addErrorPopup(error)
    }
  }, [ask, app, media, account, tokenId, amount, currencyToken])

  return (
    <button
      type="button"
      className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
      onClick={setBid}
    >
      Place Bid
    </button>
  )
}
