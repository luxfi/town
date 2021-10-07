import React from 'react'
import { useModal } from 'react-morphing-modal'
import AssetCard from './AssetCard'
import AssetModal from './AssetModal'

type AssetProps = {
  tokenId: number
  type: string
  otc?: boolean
  showPrice?: boolean
} & React.HTMLAttributes<HTMLDivElement>

function Asset({ tokenId, type, showPrice = true, otc = false }: AssetProps) {
  const { modalProps, getTriggerProps } = useModal({
    background: 'black',
  })

  return (
    <>
      <AssetCard tokenId={tokenId} type={type} getTriggerProps={getTriggerProps} showPrice={showPrice} height={40} />
      <AssetModal tokenId={tokenId} type={type} modalProps={modalProps} otc={otc} height={96} />
    </>
  )
}

export default Asset
