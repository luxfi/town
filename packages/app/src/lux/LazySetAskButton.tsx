import { Currency } from '@luxdefi/sdk'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Ask } from './types'

export type LazySetAskButtonProps = {
  // tokenId: number
  name: string
  amount: number | string
  currencyToken: Currency
  offline: boolean
}

export const LazySetAskButton = ({ name, amount, currencyToken, offline = false }: LazySetAskButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const drop = useContract('Drop')

  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  const setAsk = useCallback(async () => {
    try {
      if (amount) {
        const ask: Ask = {
          currency: currencyToken.address,
          amount: ethers.utils.parseUnits(`${amount}`, currencyToken.decimals),
          offline,
        }
        console.log('Drop.setAsk', ask)
        const tx = await drop.setTokenTypeAsk(name, ask, { from: account, gasPrice })
        addTransactionPopup(tx, `Set Ask for ${name}`)
      } else {
        // @todo - amount required message
      }
    } catch (error) {
      addErrorPopup(error)
    }
  }, [account, name, amount, currencyToken, offline])

  return (
    <button
      type="button"
      className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
      onClick={setAsk}
    >
      Set Ask
    </button>
  )
}
