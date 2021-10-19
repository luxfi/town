import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import Player from 'react-player'
import { GetTriggerProps, OpenModal } from 'react-morphing-modal/dist/types'
import { getContent } from './state'

export type AssetProps = {
  tokenId: number | string
  contentURI: string
  formattedAmount?: string
  usdAmount?: string
  symbol?: string
  className?: string
  height?: number
  width?: number
  showPrice?: boolean
  autoPlay?: boolean
  animate?: boolean
  large?: boolean,
} & React.HTMLAttributes<HTMLDivElement>

const Asset = (props: AssetProps) => {
  const { tokenId, showPrice, formattedAmount, usdAmount, symbol } = props
  const { type, image, video } = getContent(props.contentURI)

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
            <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">
              {formattedAmount} {symbol}
            </div>
            {usdAmount !== '0' && <div className="text-gray-400">
              ${usdAmount}
            </div>}
          </>          
        )}
      </div>
    </div>
  )
}

export default Asset
