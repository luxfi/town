import { EyeIcon, PencilIcon } from '@heroicons/react/solid'
import { BigintIsh, Currency, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import { getCurrencyTokenLowerCase } from '../config/currencies'
import { formatCurrencyAmountWithCommas, shortenAddress } from '../functions'
import { useActiveWeb3React } from '../hooks'
import { getContent, usePrice } from './state'
import { GraphAsk } from './types'

export type AskProps = {
  ask: GraphAsk
  showToken?: boolean
  label?: string
  summary?: string
  onClick?: (ask: GraphAsk) => void
  getUsdAmount?: (tokenAddress: string, tokenAmount: BigintIsh) => {}
}

const AskItem = ({ ask, showToken, summary, onClick }: AskProps) => {
  const { chainId, account } = useActiveWeb3React()
  const [formattedAmount, setFormattedAmount] = useState(null)
  const [currencyToken, setCurrencyToken] = useState(new Token(chainId, ZERO_ADDRESS, 18) as Currency)
  const { getUsdAmount } = usePrice()
  const { type, given_name } = getContent(ask.media.contentURI)
  const tokenId = ask?.media?.id
  
  useEffect(() => {
    const token = getCurrencyTokenLowerCase(ask.currency.id, chainId)
    if (token) {
      setCurrencyToken(token)
      setFormattedAmount(formatCurrencyAmountWithCommas(token, ask.amount))
    }
  }, [ask, chainId])

  const usdAmount = getUsdAmount && getUsdAmount(ask.currency.id, ask.amount)

  return (
    <div className="py-2 AskItem">
      <div className="grid grid-cols-2">
        {showToken ? (
          <div>
            <div>
              Ask for {given_name || type}
              <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
                {tokenId}
              </span>
            </div>
            <small className="text-gray-500">
              By {shortenAddress(ask?.owner?.id)} <TimeAgo date={new Date(parseInt(ask.createdAtTimestamp) * 1000)} />
            </small>
          </div>
        ) : (
          <div>
            <div>Owner {shortenAddress(ask?.owner?.id)} {summary}</div>
            <small className="text-gray-500">
              <TimeAgo date={new Date(parseInt(ask.createdAtTimestamp) * 1000)} />
            </small>
          </div>
        )}
        <div className="flex justify-end">
          <div className="text-right">
            <div>
              {formattedAmount} {currencyToken?.symbol}
            </div>
            {/* {usdAmount && <small className="text-gray-500">${usdAmount}</small>} */}
          </div>
          {onClick && (
            <div onClick={() => onClick(ask)}>
              <EyeIcon className="p-2 ml-3 bg-gray-700 rounded-full cursor-pointer" width={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AskItem
