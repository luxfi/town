import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Dots from '../components/Dots'
import { shortenAddress } from '../functions'
import { formatError } from '../functions/lux'
import { useActiveWeb3React, useContract } from '../hooks'
import { useAsset } from './state'
import { Ask, CurrencyToken, Bid } from './types'
import { ERC20_ABI } from '../constants/abis/erc20'
import { ethers } from 'ethers'
import { useGasPrice } from '../state/network/hooks'

const SetBid = ({ type, tokenId, children }) => {
  const { account, library } = useActiveWeb3React()
  const { formattedBalance, symbol } = useAsset(tokenId)

  const gasPrice = useGasPrice()
  const app = useContract('App')
  const market = useContract('Market')
  const media = useContract('Media')

  const approveAskAllowance = async (ask: Ask) => {
    const erc20 = new ethers.Contract(ask.currency, ERC20_ABI, library.getSigner(account))
    return erc20.approve(market.address, ask.amount)
  }

  const buyNFT = async (ask: Ask, currency: CurrencyToken) => {
    console.log({ ask, currency })
    if (currency.isNative) {
      const tx = await app.buyNFT(1, tokenId, { from: account, gasPrice, value: ask.amount })
      console.log(await tx.wait())
    } else {
      try {
        const bid: Bid = {
          amount: ask.amount,
          currency: currency.address,
          bidder: account,
          recipient: account,
          sellOnShare: { value: 0 },
          offline: ask.offline,
        }
        const approvalTx = await approveAskAllowance(ask)
        console.log(await approvalTx.wait())
        const tx = await media.setBid(tokenId, bid)
        console.log(await tx.wait())
      } catch (error) {
        console.log(error)
        console.log(formatError(error))
      }
    }
  }

  return (
    <div className="sm:p-4 md:p-0">
      <div className="py-3 text-right">
        <div className="text-gray-500">{account && shortenAddress(account)}</div>
        <div className="text-xl">
          <>
            {formattedBalance ? (
              <div>
                Balance {formattedBalance} {symbol}
              </div>
            ) : (
              <Dots>{i18n._(t`Loading`)}</Dots>
            )}
          </>
        </div>
      </div>
      <button
        type="button"
        className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
        // onClick={() => {
        //   if (ask && currency) {
        //     buyNFT(ask, currency)
        //   }
        // }}
      >
        Reserve {type}{' '}
        <span className="px-2 py-1 ml-1 text-xs font-bold text-black bg-gray-300 rounded-full lux-font AssetModal__token-id">
          {tokenId}
        </span>
      </button>
      <div>{children}</div>
    </div>
  )
}

export default SetBid
