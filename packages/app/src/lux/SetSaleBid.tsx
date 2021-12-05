import { useEffect, useState } from 'react'
import { CurrencyAmount } from '@luxdefi/sdk'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import {
  formatCurrencyAmount,
  formatCurrencyFromRawAmount,
  numberWithCommas,
  shortenAddress,
  shortenString,
} from '../functions'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useContract } from '../hooks'
import { useAsset, usePrice, useTokenType } from './state'
import { InfinityLoader } from './InfinityLoader'
import { SetSaleBidButton } from './SetSaleBidButton'
import Dots from '../components/Dots'
import { getExplorerLink } from '../functions/explorer'
import Input from '../components/Input'
import Button from '../components/Button'
import CurrencyLogo from './CurrencyLogo'
import SelectCurrency from './SelectCurrency'
import { formatEther } from 'ethers/lib/utils'
import { useCurrencyBalance } from '../state/wallet/hooks'

const SetSaleBid = ({ dropId, name, children }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const { ask, currencyToken, formattedAmount, formattedBalance, symbol, type, usdAmount } = useTokenType(dropId, name)
  const { getUsdAmount, prices } = usePrice()
  const [pendingTx, setPendingTx] = useState(null)
  const [offlineBidder, setOfflineBidder] = useState(null)
  const market = useContract('Market')
  const [value, setValue] = useState('')
  const [selectedCurrencyToken, setSelectedCurrencyToken] = useState(null)
  const [showSelectCurrency, setShowSelectCurrecy] = useState(false)
  const [approvalState, approve] = useApproveCallback(
    CurrencyAmount.fromRawAmount(selectedCurrencyToken || currencyToken, ask?.amount || 0),
    market.address
  )
  const [minimumAmount, setMinimumAmount] = useState(0)
  const [balance, setBalance] = useState('0')
  const currencyBalance = useCurrencyBalance(account, selectedCurrencyToken)
  const rawAmount = ask ? formatCurrencyFromRawAmount(currencyToken, ask?.amount) : ''
  const [priceSymbol, setPriceSymbol] = useState('')
  const price = prices?.[priceSymbol]?.usd
  const modRawAmount = price ? parseFloat(rawAmount) / price : parseFloat(rawAmount)
  useEffect(() => {
    if (currencyBalance) {
      setBalance(numberWithCommas(currencyBalance.toFixed(0)))
    }
  }, [currencyBalance])

  useEffect(() => {
    setPendingTx(null)
  }, [name, account, chainId])

  useEffect(() => {
    if (account) {
      market.isOfflineBidder(account).then(setOfflineBidder).catch(console.log)
    }
  }, [account])
  useEffect(() => {
    if (currencyToken) {
      setSelectedCurrencyToken(currencyToken)
    }
  }, [currencyToken, ask])
  useEffect(() => {
    setMinimumAmount((5 / 100) * modRawAmount + modRawAmount)
  }, [value])
  const onSelectCurrency = (currencyToken) => {
    setSelectedCurrencyToken(currencyToken)
    setPriceSymbol(currencyToken.symbol === 'ETH' ? 'ethereum' : currencyToken.symbol === 'WETH' ? 'weth' : '')
    setShowSelectCurrecy(false)
    setValue('')
  }

  return (
    <div className="m-auto sm:p-4 md:p-0 w-96">
      <div className="mb-10 text-right">
        <div className={`${formattedBalance === '0' && !offlineBidder ? 'text-red' : 'text-gray-500'}`}>
          {account && shortenAddress(account)}
        </div>
        <div className="text-xl">
          <>
            {balance ? (
              <div className={`${balance === '0' && !offlineBidder ? 'text-red' : ''}`}>
                Balance {balance} {selectedCurrencyToken?.symbol}
              </div>
            ) : (
              <Dots>{i18n._(t`Loading`)}</Dots>
            )}
          </>
        </div>
      </div>
      {showSelectCurrency ? (
        <SelectCurrency onSelect={onSelectCurrency} />
      ) : (
        <div className="relative flex items-center w-full mb-4">
          <Input.Numeric
            className="w-full p-3 text-2xl rounded bg-dark-700 focus:ring focus:ring-indigo-600"
            value={value}
            onUserInput={(value) => {
              setValue(value)
            }}
          />
          {selectedCurrencyToken && (
            <Button
              variant="outlined"
              color="gray"
              size="sm"
              onClick={() => setShowSelectCurrecy(true)}
              className="absolute right-2 focus:ring focus:ring-indigo-600"
            >
              <div className="relative flex items-center">
                <CurrencyLogo symbol={selectedCurrencyToken?.symbol} size={20} />
                <div className="ml-2 font-bold">{selectedCurrencyToken?.symbol}</div>
              </div>
            </Button>
          )}
        </div>
      )}
      {parseFloat(value) < minimumAmount && (
        <div className="py-2 text-xs font-semibold text-center">
          The minimum bid amount is {selectedCurrencyToken?.symbol} {numberWithCommas(minimumAmount.toFixed(4))}
        </div>
      )}

      {!currencyToken?.isNative &&
        [ApprovalState.NOT_APPROVED, ApprovalState.UNKNOWN].includes(approvalState) &&
        formattedBalance !== '0' && (
          <div>
            <button
              type="button"
              className="px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md w-96 hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
              onClick={approve}
            >
              Approve {value} {selectedCurrencyToken?.symbol}
            </button>
          </div>
        )}
      {formattedBalance === '0' && !offlineBidder && (
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
      {(approvalState === ApprovalState.APPROVED || currencyToken?.isNative || offlineBidder) &&
        (formattedBalance !== '0' || offlineBidder) && (
          <SetSaleBidButton
            ask={ask}
            dropId={dropId}
            name={name}
            amount={0}
            currencyToken={currencyToken}
            isAllowed={parseFloat(value) >= minimumAmount}
          />
        )}
      <div className="pt-3">
        {pendingTx && (
          <p className="cursor-pointer ">
            <a
              href={getExplorerLink(chainId, pendingTx, 'transaction')}
              target="_blockchain_browser"
              className="flex justify-center"
            >
              {shortenString(pendingTx, 38)} <InfinityLoader height={22} width={30} />
            </a>
          </p>
        )}

        {children}
      </div>
    </div>
  )
}

export default SetSaleBid
