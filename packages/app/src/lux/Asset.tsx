import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { GetTriggerProps, OpenModal } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
import { TYPE_ATM, TYPE_CASH, TYPE_VALIDATOR, TYPE_WALLET } from '../functions/assets'
import { useAsset } from './state'

export type AssetProps = {
  tokenId: number | string
  contentURI: string
  formattedAmount?: string
  symbol?: string
  className?: string
  height?: number
  width?: number
  showPrice?: boolean
  autoPlay?: boolean
  animate?: boolean
  large?: boolean
  getTriggerProps?: GetTriggerProps
  openModal?: OpenModal
} & React.HTMLAttributes<HTMLDivElement>

const getContent = (contentURI) => {
  const type = contentURI?.match(/\/(\w+)\.(\w+)$/)[1] || ''
  return{
    type,
    image: `/nfts/${type.toLowerCase()}.gif`,
    video: `/nfts/${type.toLowerCase()}.mov`,
  }
}

const Asset = (props: AssetProps) => {
  const router = useRouter()
  const assetRef = useRef(null);
  const { tokenId, showPrice, formattedAmount, symbol } = props
  const { tokenId: activeTokenId } = router.query
  const isActive = tokenId === activeTokenId
  const { type, image, video } = getContent(props.contentURI)

  const onClick = () => {
    router.push(`/?tokenId=${tokenId}`, undefined, { shallow: true })
    props.openModal && props.openModal(assetRef, { id: tokenId })
  }

  useEffect(() => {
    if (isActive) {
      props.openModal && props.openModal(assetRef)
    }
  }, [tokenId])

  return (
    <div
      className={`Asset ${props.className || ''} ${props.openModal ? 'cursor-pointer' : ''}`}
      ref={assetRef}
      onClick={onClick}
    >
      {props.large ? (
        <Player url={video} playing={true} loop width={'auto'} height={'auto'} style={{ height: 'auto' }} />
      ) : (
        <img src={image} alt={`${type} ${tokenId}`} />
      )}
      <div className={`w-full pb-5 text-center backdrop-filter backdrop-opacity video-overlay`}>
        <div>
          <span className="text-lg text-gray-300">{type}</span>
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
            {tokenId}
          </span>
        </div>
        {showPrice && formattedAmount && symbol && (
          <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">
            {formattedAmount} {symbol}
          </div>
        )}
      </div>
    </div>
  )
}

export default Asset
