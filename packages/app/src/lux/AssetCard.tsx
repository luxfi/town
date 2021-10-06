import React from 'react'
import { GetTriggerProps } from 'react-morphing-modal/dist/types'

type AssetCardProps = {
  tokenId: number
  type: string
  width?: number
  getTriggerProps?: GetTriggerProps
} & React.HTMLAttributes<HTMLDivElement>

function AssetCard(props: AssetCardProps) {
  const triggerProps = props.getTriggerProps ? { ...props.getTriggerProps({ id: props.tokenId }) } : {}
  return (
    <>
      <div
        className={`w-${props.width || '60'} m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 md:w-${
          props.width || '60'
        } ${props.className || ''}`}
        {...triggerProps}
      >
        <a href="#" className="block w-full h-full">
          <img
            alt="blog photo"
            src="https://www.geeky-gadgets.com/wp-content/uploads/2011/04/Collector-USB-Flash-Drive-Concept-b.jpg"
            className="object-cover w-full max-h-100"
          />
          <div className="w-full p-4 dark:bg-gray-800">
            <p className="font-medium text-indigo-500 text-md"></p>
            <p className="mb-2 text-xl font-medium dark:text-white">
              {props.type} #{props.tokenId}
            </p>
            <p className="font-light text-gray-400 dark:text-gray-300 text-md">Some description...</p>
          </div>
        </a>
      </div>
    </>
  )
}

export default AssetCard
