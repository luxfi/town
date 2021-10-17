import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Dots from '../components/Dots'
import { formatCurrencyAmount, formatCurrencyFromRawAmount, shortenAddress, shortenString } from '../functions'
import { formatError, wait, waitOnHardhat } from '../functions/lux'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useContract } from '../hooks'
import { useAsset } from './state'
import { Ask, CurrencyToken, Bid } from './types'
import { ERC20_ABI } from '../constants/abis/erc20'
import { ethers } from 'ethers'
import { useGasPrice } from '../state/network/hooks'
import { Currency, CurrencyAmount, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import { useEffect, useState } from 'react'
import { useLingui } from '@lingui/react'
import Input from '../components/Input'
import Button from '../components/Button'
import Image from '../components/Image'
import { InfinityLoader } from './InfinityLoader'
import { useAddPopup } from '../state/application/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'

const SetBid = ({ type, tokenId, children }) => {
  const { account, chainId } = useActiveWeb3React()
  const { ask, currencyToken, formattedAmount, formattedBalance, symbol } = useAsset(tokenId)
  const [pendingTx, setPendingTx] = useState(null)
  const addPopup = useAddPopup()
  const addTransaction = useTransactionAdder()
  const gasPrice = useGasPrice()
  const app = useContract('App')
  const market = useContract('Market')
  const media = useContract('Media')

  const [approvalState, approve] = useApproveCallback(
    CurrencyAmount.fromRawAmount(currencyToken, ask?.amount || 0),
    market.address
  )

  const waitForTransaction = async (tx: any, summary: string) => {
    setPendingTx(tx.hash)
    addTransaction(tx, { summary })
    await waitOnHardhat(chainId, 100000)
    const receipt = await tx.wait()
    console.log({ tx, receipt })
  }

  const buyNFT = async (ask: Ask, currencyToken: CurrencyToken) => {
    if (currencyToken.isNative) {
      try {
        const tx = await app.buyNFT(1, tokenId, { from: account, gasPrice, value: ask.amount })
        await waitForTransaction(tx, `Reserved ${type} ${tokenId}`)
      } catch (error) {
        console.log(error)
        addPopup({
          txn: {
            hash: null,
            summary: formatError(error),
            success: false,
          },
        })
      }
    } else {
      try {
        const bid: Bid = {
          amount: ask.amount,
          currency: currencyToken.address,
          bidder: account,
          recipient: account,
          sellOnShare: { value: 0 },
          offline: ask.offline,
        }

        const tx = await media.setBid(tokenId, bid)
        await waitForTransaction(tx, `Reserved ${type} ${tokenId}`)
      } catch (error) {
        console.log(error)
        addPopup({
          txn: {
            hash: null,
            summary: formatError(error),
            success: false,
          },
        })
      }
    }
  }

  useEffect(() => {
    setPendingTx(null)
  }, [tokenId, account, chainId])

  return (
    <div className="sm:p-4 md:p-0">
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
            className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
            onClick={approve}
          >
            Approve {formattedAmount} {symbol}
          </button>
        )}
      {formattedBalance === '0' && (
        <button
          type="button"
          className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in rounded-lg shadow-md bg-red focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
          disabled
        >
          Insufficient {symbol} Balance
        </button>
      )}
      {!currencyToken?.isNative && approvalState === ApprovalState.PENDING && (
        <button
          type="button"
          className="flex justify-center w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-black rounded-lg shadow-md hover:bg-red focus:ring-offset-red focus:outline-none focus:ring-offset-2"
          disabled
        >
          Approving
          <InfinityLoader />
        </button>
      )}
      {(approvalState === ApprovalState.APPROVED || currencyToken?.isNative) && formattedBalance !== '0' && (
        <button
          type="button"
          className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
          onClick={() => {
            if (ask && currencyToken) {
              buyNFT(ask, currencyToken)
            }
          }}
        >
          Reserve {type}{' '}
          <span className="px-2 py-1 ml-1 text-xs font-bold text-black bg-gray-300 rounded-full lux-font AssetModal__token-id">
            {tokenId}
          </span>
        </button>
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
