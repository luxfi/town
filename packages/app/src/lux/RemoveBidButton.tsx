import { isNativeCurrency } from '@luxdefi/sdk'
import { useCallback } from 'react'
import { useActiveWeb3React, useContract } from '../hooks'
import { useGasPrice } from '../state/network/hooks'
import { useTransactionPopups } from '../state/transactions/hooks'
import { TokenId } from './types'

export type RemoveBidButtonProps = {
  tokenId: TokenId
  tokenType: string
  currency: string
  onError?: (error) => void
  onRemove?: (tokenId: TokenId) => void
}

export const RemoveBidButton = ({ tokenId, tokenType, currency, onError, onRemove }: RemoveBidButtonProps) => {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const media = useContract('Media')

  const { addErrorPopup, addTransactionPopup } = useTransactionPopups()

  const removeBid = useCallback(async () => {
    try {
      const txSummary = `Removed Bid for ${tokenType} ${tokenId}`

      if (isNativeCurrency(currency)) {
        console.log('app.removeBid', tokenId, { from: account, gasPrice })
        const tx = await app.removeBid(tokenId, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      } else {
        console.log('media.removeBid', tokenId, { from: account, gasPrice })
        const tx = await media.removeBid(tokenId, { from: account, gasPrice })
        addTransactionPopup(tx, txSummary)
      }

      onRemove && onRemove(tokenId)

    } catch (error) {
      addErrorPopup(error)
      onError && onError(error)
    }
  }, [app, media, account, tokenId, currency])

  return (
    <button
      type="button"
      className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in rounded-lg shadow-md bg-red hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
      onClick={removeBid}
    >
      Remove Bid
    </button>
  )
}
