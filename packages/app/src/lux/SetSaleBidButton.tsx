import { Currency, isNativeCurrency } from '@luxdefi/sdk'
import { useCallback } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Ask, Bid } from './types'

export type SetSaleBidButtonProps = {
  ask: Ask
  dropId: number
  name: string
  amount: number | string
  currencyToken: Currency
}

export const SetSaleBidButton = ({
  ask,
  dropId,
  name,
  amount,
  currencyToken,
}: SetSaleBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')

  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  const setLazyBid = useCallback(async () => {
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

      const txSummary = `Placed Bid for ${name}`

      if (isNativeCurrency(currencyToken.address) && !ask.offline) {
        console.log('app.setLazyBid', bid, { from: account, gasPrice, value: bid.amount })
        const tx = await app.setLazyBid(dropId, name, bid, { from: account, gasPrice, value: bid.amount })
        addTransactionPopup(tx, txSummary)
      } else {
        console.log('app.setLazyBidERC20', bid, { from: account, gasPrice })
        const tx = await app.setLazyBidERC20(dropId, name, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      }
    } catch (error) {
      addErrorPopup(error)
    }
  }, [ask, app, account, name, amount, currencyToken])

  return (
    <button
      type="button"
      className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
      onClick={setLazyBid}
    >
      Place {ask.offline && 'Offline'} Bid
    </button>
  )
}
