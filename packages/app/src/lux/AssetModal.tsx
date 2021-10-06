import { Modal } from 'react-morphing-modal'

import AssetCard from './AssetCard'

const AssetModal = ({ tokenId, type, modalProps, otc }) => {
  return (
    <Modal {...modalProps} padding={0}>
      <div className="grid grid-cols-2 gap-30">
        <div className="flex items-stretch h-screen">
          <AssetCard className="self-center" tokenId={tokenId} type={type} width={80} />
        </div>
        <div className="flex items-stretch h-screen bg-gray-900">
          <div className="self-center m-auto w-80">
            <h2 className="pb-4">Reserve Price: 1000 ETH</h2>
            {/* <div className="pb-4">Reserve Price: 1000 ETH</div> */}
            <button
              type="button"
              className="w-full px-4 py-3 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2 "
            >
              Reserve {type}
            </button>
            <p className="p-4 text-center">You cannot withdraw your reservation once submitted.</p>
            <p className="p-4 text-center">How do reservations work?</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AssetModal
