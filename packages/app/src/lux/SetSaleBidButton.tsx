import { Switch } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { Currency, isNativeCurrency } from '@luxdefi/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Ask, Bid } from './types'
import Typography from '../components/Typography'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

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
  const [offline, setOffline] = useState(false)
  const [offlineSwitch, showOfflineSwitch] = useState(false)
  const app = useContract('App')
  const market = useContract('Market')

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
        offline,
      }

      const txSummary = `Placed Bid for ${name}`

      if (isNativeCurrency(currencyToken.address) && !offline) {
        console.log('app.setLazyBid', bid, { from: account, gasPrice, value: bid.amount })
        const tx = await app.setLazyBid(dropId, name, bid, { from: account, gasPrice, value: bid.amount })
        addTransactionPopup(tx, txSummary)
      } else {
        console.log(bid)
        console.log('app.setLazyBidERC20', bid, { from: account, gasPrice })
        const tx = await app.setLazyBidERC20(dropId, name, bid, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      }
    } catch (error) {
      addErrorPopup(error)
    }
  }, [ask, app, account, name, amount, currencyToken, offline])

  useEffect(() => {
    if (account) {
      market.isOfflineBidder(account).then(showOfflineSwitch).catch(console.log)
    }
  }, [account])

  return (
    <>
      <button
        type="button"
        className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
        onClick={setLazyBid}
      >
        Place {offline && 'Offline'} Bid
      </button>

      {offlineSwitch && <div className="pt-3">
        <Switch.Group>
          <div className="flex items-center justify-center">
            <Switch.Label className="mr-3 cursor-pointer">
              <Typography>{i18n._(t`Offline`)}</Typography>
            </Switch.Label>
            <Switch
              checked={offline}
              onChange={() => setOffline(!offline)}
              className="bg-indigo-500 bg-opacity-60 border border-indigo-600 border-opacity-80 relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none"
            >
              <span
                className={`${
                  offline ? 'translate-x-[23px] bg-gray-300' : 'translate-x-[1px] bg-indigo-400'
                } inline-block w-7 h-7 transform  rounded-full transition-transform text-indigo-600`}
              >
                {offline ? <CheckIcon /> : ''}
              </span>
            </Switch>
          </div>
        </Switch.Group>
      </div>}
    </>
  )
}
