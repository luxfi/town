import { Currency } from '@luxdefi/sdk'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { Ask } from './types'

export type SetAskButtonProps = {
  tokenId: number
  tokenType: string
  amount: number | string
  currencyToken: Currency
  offline: boolean
}

export const SetAskButton = ({ tokenId, tokenType, amount, currencyToken, offline = false }: SetAskButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const media = useContract('Media')

  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  const setAsk = useCallback(async () => {
    try {
      if (amount) {
        const ask: Ask = {
          currency: currencyToken.address,
          amount: ethers.utils.parseUnits(`${amount}`, currencyToken.decimals),
          offline,
        }
        console.log('setAsk', ask)
        const tx = await media.setAsk(tokenId, ask, { from: account, gasPrice })
        addTransactionPopup(tx, `Set Ask for ${tokenType} ${tokenId}`)
      } else {
        // @todo - amount required message
      }
    } catch (error) {
      addErrorPopup(error)
    }
  }, [media, account, tokenId, amount, currencyToken, offline])

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
