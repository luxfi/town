import React, { useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
import { NFT_VALIDATOR, NFT_ATM, NFT_WALLET, NFT_CASH } from '../functions/assets'

export type AssetProps = {
  tokenId: number
  type: string
  image: string
  video: string
  className?: string
  height?: number
  width?: number
  showPrice?: boolean
  autoPlay?: boolean
  getTriggerProps?: GetTriggerProps
} & React.HTMLAttributes<HTMLDivElement>

const textOffset = {
  [NFT_VALIDATOR]: 170,
  [NFT_ATM]: 40,
  [NFT_WALLET]: 140,
  [NFT_CASH]: 150,
}

const Asset = (props: AssetProps) => {
  return (
    <div
      className={`Asset ${props.className || ''} ${props.getTriggerProps ? 'cursor-pointer' : ''}`}
      {...(props.getTriggerProps ? props.getTriggerProps({ id: props.tokenId }) : {})}
    >
      {props.autoPlay ? (
        <Player url={props.video} playing={true} loop width={'auto'} height={'auto'} style={{ height: 'auto' }} />
      ) : (
        <img src={props.image} alt={`${props.type} ${props.tokenId}`} />
      )}
      <div
        className={`w-full pb-5 text-center backdrop-filter backdrop-opacity video-overlay`}
        style={{ position: 'relative', bottom: props.showPrice ? textOffset[props.type] : 0 }}
      >
        <div>
          <span className="text-lg text-gray-300">{props.type}</span>
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
            {props.tokenId}
          </span>
        </div>
        {props.showPrice && <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">Price 1000 ETH</div>}
      </div>
    </div>
  )
}

export default Asset
