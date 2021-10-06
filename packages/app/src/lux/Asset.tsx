import React from 'react'
import { useModal } from 'react-morphing-modal'
import AssetCard from './AssetCard'
import AssetModal from './AssetModal'

type AssetProps = {
  tokenId: number
  type: string
  otc: boolean
} & React.HTMLAttributes<HTMLDivElement>

function Asset({ tokenId, type, otc = false }: AssetProps) {
  const { modalProps, getTriggerProps } = useModal({
    background: 'black',
  })

  return (
    <>
      <AssetCard tokenId={tokenId} type={type} getTriggerProps={getTriggerProps} />
      <AssetModal tokenId={tokenId} type={type} modalProps={modalProps} otc={otc} />
    </>
  )
}

export default Asset
