import { Modal } from 'react-morphing-modal'
import AssetCard from './AssetCard'

const AssetModal = ({ tokenId, type, modalProps }) => {
  return (
    <Modal {...modalProps} padding={0}>
      <div className="grid grid-cols-2 gap-30">
        <div className="flex items-stretch h-screen">
          <AssetCard className="self-center" tokenId={tokenId} type={type} width={80} />
        </div>
        <div className="h-screen bg-gray-800"></div>
      </div>
    </Modal>
  )
}

export default AssetModal
