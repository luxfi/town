import React from 'react'
import { GetTriggerProps } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
import { TYPE_ATM, TYPE_CASH, TYPE_VALIDATOR, TYPE_WALLET } from '../functions/assets'
import { useAsset } from './state'

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

const modalOffset = {
  [TYPE_VALIDATOR]: 170,
  [TYPE_ATM]: 40,
  [TYPE_WALLET]: 140,
  [TYPE_CASH]: 150,
}

const Asset = (props: AssetProps) => {
  const { tokenId, showPrice } = props
  const { formattedAmount, symbol } = useAsset(tokenId)

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
        style={{
          position: showPrice ? 'relative' : 'static',
          bottom: showPrice ? modalOffset[props.type] : 60,
        }}
      >
        <div>
          <span className="text-lg text-gray-300">{props.type}</span>
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
            {props.tokenId}
          </span>
        </div>
        {showPrice && formattedAmount && (
          <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">
            {formattedAmount} {symbol}
          </div>
        )}
      </div>
    </div>
  )
}

export default Asset
