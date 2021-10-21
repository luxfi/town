import React, { useEffect, useRef } from 'react'
import Player from 'react-player'
import { BigintIsh, ZERO_ADDRESS } from '@luxdefi/sdk'
import { getContent } from './state'
import { Ask, Bid, HighestBid } from './types'
import { useActiveWeb3React, useContract } from '../hooks'
import { useAddPopup } from '../state/application/hooks'
import { formatError } from '../functions/lux'
import { AcceptBidButton } from './AcceptBidButton'

export type AssetProps = {
  tokenId: number | string
  contentURI: string
  ask?: Ask
  formattedAmount?: string
  usdAmount?: string
  symbol?: string
  highest?: HighestBid
  className?: string
  height?: number
  width?: number
  showPrice?: boolean
  isOwner?: boolean
  autoPlay?: boolean
  animate?: boolean
  large?: boolean,
  getUsdAmount?: (tokenAddress: string, tokenAmount: BigintIsh) => string,
} & React.HTMLAttributes<HTMLDivElement>

const Asset = (props: AssetProps) => {
  const addPopup = useAddPopup()
  const { account } = useActiveWeb3React()
  const { ask, highest, tokenId, showPrice, formattedAmount, usdAmount, symbol, getUsdAmount, isOwner } = props
  const { type, image, video } = getContent(props.contentURI)
  const app = useContract('App')
  const market = useContract('Market')
  const media = useContract('Media')
  const bidder = highest?.bid?.bidder?.id

  // const acceptBid = async () => {
  //   try {
  //     const highestBid = await market.bidForTokenBidder(tokenId, highest.bid.bidder.id)

  //     const bid: Bid = {
  //       amount: highestBid.amount,
  //       currency: highestBid.currency,
  //       bidder: highestBid.bidder,
  //       recipient: highestBid.bidder,
  //       sellOnShare: { value: 0 },
  //       offline: highestBid.offline,
  //     }

  //     console.log('acceptBid', {tokenId, ask})
  //     console.log('bid', bid)

  //     if (bid.currency === ZERO_ADDRESS) {
  //       // App contract handles ETH (ZERO_ADDRESS)
  //       const tx = await app.acceptBid(tokenId, highestBid)
  //     } else {
  //       // Media contract handles ETH (ZERO_ADDRESS)
  //       const tx = await media.acceptBid(tokenId, highestBid)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     addPopup({
  //       txn: {
  //         hash: null,
  //         summary: formatError(error),
  //         success: false,
  //       },
  //     })
  //   }
  // }

  return (
    <div
      className={`Asset ${props.className || ''} ${props.onClick ? 'cursor-pointer' : ''}`}
      onClick={props.onClick}
    >
      {props.large && video? (
        <Player url={video} playing={true} loop width={'auto'} height={'auto'} style={{ height: 'auto' }} />
      ) : (
        image && <img src={image} alt={`${type} ${tokenId}`} />
      )}
      <div className={`w-full pb-5 text-center backdrop-filter backdrop-opacity video-overlay`}>
        <div>
          <span className="text-lg text-gray-300">{type}</span>
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
            {tokenId}
          </span>
        </div>
        {showPrice && formattedAmount && symbol && (
          <>
          {highest && getUsdAmount && ask ? (
            <div className="flex justify-between px-3 py-3 my-3 bg-indigo-400 rounded-lg">
              <div className="text-black">
                <div className="text-lg">
                Highest Bid
                </div>
                <div className="text-2xl font-bold">
                {formattedAmount} {symbol}
                </div>
              </div>

              {isOwner && <AcceptBidButton bidder={bidder} tokenId={tokenId} tokenType={type} />}
            </div>
          ) : (
            <>
              <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">
                {formattedAmount} {symbol}
              </div>
              {usdAmount !== '0' && <div className="text-gray-400">
                ${usdAmount}
              </div>}
            </>
          )}
          </>          
        )}
      </div>
    </div>
  )
}

export default Asset
