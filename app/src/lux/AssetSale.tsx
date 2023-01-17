import React, { useCallback, useEffect, useRef, useState } from 'react'
import Player from 'react-player'
import { BigintIsh, ZERO_ADDRESS } from '@luxdefi/sdk'
import { getContent, useTokenType } from './state'
import { Ask, Bid, GraphBid, HighestBid } from './types'
import { useActiveWeb3React, useContract } from '../hooks'
import { EyeIcon } from '@heroicons/react/solid'
import { shortenAddress } from '../functions'
import TimeAgo from 'react-timeago'

export type AssetSaleProps = {
  dropId: number | string
  name: string
  contentURI: string
  metadataURI: string
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
  large?: boolean
  getUsdAmount?: (tokenAddress: string, tokenAmount: BigintIsh) => string
  onClickBid?: (bid: GraphBid) => void
  onClickTokenType?: (name: string) => void
} & React.HTMLAttributes<HTMLDivElement>

const AssetSale = (props: AssetSaleProps) => {
  const { account } = useActiveWeb3React()
  const { ask, highest, dropId, name, showPrice, formattedAmount, usdAmount, symbol, getUsdAmount, isOwner } = props

  const { minted, supply } = useTokenType(dropId, name)
  const [bid, setBid] = useState(null)
  const [tokenType, setTokenType] = useState(null)
  // const market = useContract('Market')
  const drop = useContract('Drop')
  // console.log('AssetSaleProps', props)
  const { type, image, video, given_name } = getContent(props.contentURI)
  const bidder = highest?.bid?.bidder?.id
  // const askAmount = ethers.utils.formatUnits(ask?.amount as BigNumberish, 1)

  // console.log('AssetSale', askAmount)

  const onClickBid = (bid: GraphBid) => {
    props.onClickBid && props.onClickBid(bid as any)
  }

  // useEffect(() => {

  //   console.log('props.name', props.name)

  //   const getTokenType = async () => {
  //     if (props.name) {
  //       setTokenType(await drop?.getTokenType(props.name))
  //     } else {
  //       setTokenType(null)
  //     }
  //   }
  //   getTokenType()
  // }, [props.name])

  return (
    <div
      className={`AssetSale ${props.className || ''} ${props.onClickTokenType ? 'cursor-pointer' : ''}`}
      onClick={() => props.onClickTokenType && props.onClickTokenType(props.name)}
    >
      {props.large && video ? (
        <Player url={video} playing={true} loop width={'auto'} height={'auto'} style={{ height: 'auto' }} />
      ) : (
        image && <img src={image} alt={`${type} ${dropId}-${name}`} />
      )}
      <div className={`w-full pb-5 text-center backdrop-filter backdrop-opacity video-overlay`}>
        <div>
          <span className="text-lg text-gray-300">{given_name || name}</span>
          <br />
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font AssetSale__token-id">
            {minted} / {supply} Sold
          </span>
        </div>
        {showPrice && formattedAmount && symbol && (
          <>
            {highest && getUsdAmount && ask ? (
              <div className="grid grid-cols-2 px-3 py-2 my-3 bg-indigo-300 rounded-lg">
                <div className="text-left">
                  <div className="text-xl text-black">Highest Bid</div>
                  {/* <div>Bidder {shortenAddress(highest?.bid?.bidder?.id)} {summary}</div> */}
                  <div className="text-gray-700">By {shortenAddress(highest?.bid?.bidder?.id)}</div>
                </div>
                <div className="flex justify-end">
                  <div className="text-right ">
                    <div className="text-xl font-bold text-black">
                      {formattedAmount} {symbol}
                    </div>
                    {usdAmount && <small className="text-gray-700">${usdAmount}</small>}
                  </div>
                  {
                    <div onClick={() => onClickBid(highest.bid)}>
                      <EyeIcon className="p-2 ml-3 bg-gray-700 rounded-full cursor-pointer" width={32} />
                    </div>
                  }
                </div>
              </div>
            ) : (
              <>
                <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">
                  {formattedAmount} {symbol}
                </div>
                {/* {usdAmount !== '0' && <div className="text-gray-400">
                ${usdAmount}
              </div>} */}
              </>
            )}
            {/* {highest && getUsdAmount && ask ? (
            <div className="grid grid-cols-2 px-3 py-3 my-3 bg-indigo-300 rounded-lg">
              <div className="text-left">
                <div className="text-lg text-indigo-700">
                  Highest Bid
                </div>
                <div className="text-xl font-bold text-black">
                {formattedAmount} {symbol}
                </div>
              </div>
              
              {isOwner && <AcceptBidButton bidder={bidder} dropId=-{name}{dropId}-{name} tokenType={type} />}
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
          )} */}
          </>
        )}
      </div>
    </div>
  )
}

export default AssetSale
