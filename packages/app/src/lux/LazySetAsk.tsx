import { Currency, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import { formatCurrencyFromRawAmount } from '../functions'
import { formatError } from '../functions/lux'
import { useActiveWeb3React, useContract } from '../hooks'
import { useAsset, useTokenType } from './state'
import { Ask } from './types'
import { ethers } from 'ethers'
import { useGasPrice } from '../state/network/hooks'
import Input from '../components/Input'
import { useEffect, useState } from 'react'
import Button from '../components/Button'
import SelectCurrency from './SelectCurrency'
import CurrencyLogo from './CurrencyLogo'
import Checkbox from '../components/Checkbox'
import { Switch } from '@headlessui/react'
import Typography from '../components/Typography'
import { CheckIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'
import { LazySetAskButton } from './LazySetAskButton'

const LazySetAsk = ({ dropId, name, children }) => {
  const { account } = useActiveWeb3React()
  const { ask, currencyToken, type } = useTokenType(dropId, name)
  const [value, setValue] = useState('')
  const [offline, setOffline] = useState(false)
  const [selectedCurrencyToken, setSelectedCurrencyToken] = useState(null)
  const [showSelectCurrency, setShowSelectCurrecy] = useState(false)

  useEffect(() => {
    if (ask && currencyToken) {
      setSelectedCurrencyToken(currencyToken)
      setValue(formatCurrencyFromRawAmount(currencyToken, ask.amount))
      setOffline(ask.offline)
    }
  }, [ask, currencyToken])

  const onSelectCurrency = (currencyToken) => {
    setSelectedCurrencyToken(currencyToken)
    setShowSelectCurrecy(false)
    setValue('')
  }

  return (
    <div className="sm:p-4 md:p-0">
      {showSelectCurrency ? (
        <SelectCurrency onSelect={onSelectCurrency} />
      ) : (
        <>
          <h2 className="mb-10 text-xl text-center">
            Set Ask for {name}
          </h2>
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
          <LazySetAskButton
            name={name}
            amount={value}
            currencyToken={selectedCurrencyToken}
            offline={offline}
          />
          {/* <div className="pt-3">
            <Switch.Group>
              <div className="flex items-center justify-center">
                <Switch.Label className="mr-3 cursor-pointer">
                  <Typography>{i18n._(t`Offline Ask`)}</Typography>
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
          </div> */}
          <div>{children}</div>
        </>
      )}
    </div>
  )
}

export default LazySetAsk
