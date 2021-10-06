import React from 'react'
import { useModal } from 'react-morphing-modal'
import { classNames } from '../functions/styling'
import AssetCard from './AssetCard'
import AssetModal from './AssetModal'

type AssetProps = {
  tokenId: number
  type: string
} & React.HTMLAttributes<HTMLDivElement>

function Asset({ tokenId, type }: AssetProps) {
  const { modalProps, getTriggerProps } = useModal({
    background: 'black',
  })

  return (
    <>
      <AssetCard tokenId={tokenId} type={type} getTriggerProps={getTriggerProps} />
      <AssetModal tokenId={tokenId} type={type} modalProps={modalProps} />
    </>
  )
}

export default Asset
