import { Currency, CurrencyAmount, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Dots from '../components/Dots'
import { formatCurrencyAmount, formatCurrencyFromRawAmount, shortenAddress, shortenString } from '../functions'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useContract } from '../hooks'
import { useAsset } from './state'
import { useGasPrice } from '../state/network/hooks'
import { useEffect, useState } from 'react'
import { InfinityLoader } from './InfinityLoader'
import { SetBidButton } from './SetBidButton'

const SetBid = ({ tokenId, children }) => {
  const { account, chainId } = useActiveWeb3React()
  const { ask, currencyToken, formattedAmount, formattedBalance, symbol, type } = useAsset(tokenId)
  const [pendingTx, setPendingTx] = useState(null)
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const market = useContract('Market')
  const media = useContract('Media')
  
  const [approvalState, approve] = useApproveCallback(
    CurrencyAmount.fromRawAmount(currencyToken, ask?.amount || 0),
    market.address
  )

  useEffect(() => {
    setPendingTx(null)
  }, [tokenId, account, chainId])

  return (
    <div className="m-auto sm:p-4 md:p-0 w-96">
      <div className="mb-10 text-right">
        <div className={`${formattedBalance === '0' ? 'text-red' : 'text-gray-500'}`}>
          {account && shortenAddress(account)}
        </div>
        <div className="text-xl">
          <>
            {formattedBalance ? (
              <div className={`${formattedBalance === '0' ? 'text-red' : ''}`}>
                Balance {formattedBalance} {symbol}
              </div>
            ) : (
              <Dots>{i18n._(t`Loading`)}</Dots>
            )}
          </>
        </div>
      </div>
      {!currencyToken?.isNative &&
        [ApprovalState.NOT_APPROVED, ApprovalState.UNKNOWN].includes(approvalState) &&
        formattedBalance !== '0' && (
          <button
            type="button"
            className="px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md w-96 hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
            onClick={approve}
          >
            Approve Bid {formattedAmount} {symbol}
          </button>
        )}
      {formattedBalance === '0' && (
        <button
          type="button"
          className="px-4 py-3 text-xl text-center text-white transition duration-200 ease-in rounded-lg shadow-md w-96 bg-red focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
          disabled
        >
          Insufficient {symbol} Balance
        </button>
      )}
      {!currencyToken?.isNative && approvalState === ApprovalState.PENDING && (
        <button
          type="button"
          className="flex justify-center px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-black rounded-lg shadow-md w-96 hover:bg-red focus:ring-offset-red focus:outline-none focus:ring-offset-2"
          disabled
        >
          Approving
          <InfinityLoader />
        </button>
      )}
      {(approvalState === ApprovalState.APPROVED || currencyToken?.isNative) && formattedBalance !== '0' && (
        <SetBidButton
          ask={ask}
          tokenType={type}
          tokenId={tokenId}
          amount={0}
          currencyToken={currencyToken}
        />
      )}
      <div className="pt-3">
        {pendingTx ? (
          <p className="cursor-pointer ">
            <a
              href={`https://etherscan.io/tx/${pendingTx}`}
              target="_blockchain_browser"
              className="flex justify-center"
            >
              {shortenString(pendingTx, 38)} <InfinityLoader height={22} width={30} />
            </a>
          </p>
        ) : (
          <p className="text-center">You cannot withdraw a reservation once submitted.</p>
        )}
        {children}
      </div>
    </div>
  )
}

export default SetBid
