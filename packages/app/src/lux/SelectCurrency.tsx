import { useActiveWeb3React } from '../hooks'
import { getSupportedPaymentCurrencies } from '../config/currencies'
import CurrencyLogo from './CurrencyLogo'

const SelectCurrency = ({ onSelect }) => {
  const { chainId } = useActiveWeb3React()
  return (
    <div className="sm:p-4 md:p-0">
      <h2 className="mb-3 text-xl text-center">Select a Currency</h2>
      <div className="grid grid-flow-row-dense grid-cols-2 gap-2 overflow-y-auto">
        {getSupportedPaymentCurrencies(chainId).map((currency) => (
          <button key={currency.symbol} className="w-full col-span-1 p-px rounded" onClick={() => onSelect(currency)}>
            <div className="flex items-center w-full h-full p-3 space-x-3 rounded bg-dark-1000">
              <CurrencyLogo symbol={currency.symbol} className="mr-5" /> <div>{currency.symbol}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SelectCurrency
