import React from 'react'
import { GetTriggerProps } from 'react-morphing-modal/dist/types'

type AssetCardProps = {
  tokenId: number
  type: string
  height?: number
  width?: number
  showPrice?: boolean
  autoPlay?: boolean
  getTriggerProps?: GetTriggerProps
} & React.HTMLAttributes<HTMLDivElement>

function AssetCard(props: AssetCardProps) {
  const triggerProps = props.getTriggerProps ? { ...props.getTriggerProps({ id: props.tokenId }) } : {}
  return (
    <>
      <div
        className={`w-${props.width || '60'} m-auto rounded shadow-lg cursor-pointer h-${props.height || '96'} md:w-${
          props.width || '60'
        } ${props.className || ''}`}
        {...triggerProps}
      >
        <a href="#" className="block w-full h-full">
          <video autoPlay={props.autoPlay} loop muted poster="/images/nfts/cube.png">
            <source src="/videos/nfts/cube.mp4" />
          </video>
          <div className="w-full pt-3 pb-5 mt-8 text-center">
            <p className="font-medium text-indigo-500 text-md"></p>
            <p className="text-xl font-medium text-white text-uppercase lux-font">
              {props.type} #{props.tokenId}
            </p>
            {props.showPrice && (
              <div>
                <div className="mb-3 font-light text-indigo-500 text-md">Reservation Price</div>
                <b className="px-2 py-1 text-xl text-indigo-500 border-2 border-indigo-500 rounded">1000 ETH</b>
              </div>
            )}
          </div>
        </a>
      </div>
    </>
  )
}

export default AssetCard
