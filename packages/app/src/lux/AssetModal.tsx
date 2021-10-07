import { Modal } from 'react-morphing-modal'
import { HiOutlineChevronLeft } from 'react-icons/hi'

import AssetCard from './AssetCard'
import { useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import { useETHBalances } from '../state/wallet/hooks'
import Dots from '../components/Dots'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'
import { shortenAddress } from '../functions'

const AssetModal = ({ tokenId, type, modalProps, height, otc }) => {
  const [showHow, setShowHow] = useState(false)
  const { chainId, account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  return (
    <Modal {...modalProps} padding={0} closeButton={false}>
      <div className="grid md:grid-cols-2 gap-30 sm:grid-cols-1">
        <div className="flex items-stretch h-screen">
          <div
            onClick={modalProps.close}
            className="flex items-center justify-center mt-5 ml-5 bg-gray-800 rounded-full shadow-2xl cursor-pointer h-14 w-14"
          >
            <HiOutlineChevronLeft />
          </div>
          <AssetCard
            className="self-center"
            tokenId={tokenId}
            type={type}
            width={96}
            height={height}
            showPrice
            autoPlay
          />
        </div>
        <div className="flex items-stretch h-screen bg-gray-900">
          <div className="self-center m-auto w-96">
            {showHow ? (
              <div>
                <h2 className="pb-4 text-2xl">How do reservations work?</h2>
                <p className="mb-5">
                  Reserve your NFT to ensure you are part of the LUX network at launch. If your bid is not accepted,
                  your reservation will be refunded.
                </p>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2 "
                  onClick={() => setShowHow(false)}
                >
                  Ok
                </button>
              </div>
            ) : (
              <div>
                <div className="py-3 text-right">
                  <div className="text-gray-500">{account && shortenAddress(account)}</div>
                  <div className="text-xl">
                    {account && chainId && (
                      <>
                        {userEthBalance ? (
                          <div>Balance {userEthBalance?.toSignificant(4)} ETH</div>
                        ) : (
                          <Dots>{i18n._(t`Loading`)}</Dots>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-xl text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2"
                >
                  Reserve {type} #{tokenId}
                </button>
                <div className="pt-3">
                  <p className="text-center">You cannot withdraw a reservation once submitted.</p>
                  <p className="text-center text-indigo-400 cursor-pointer" onClick={() => setShowHow(true)}>
                    How do reservations work?
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AssetModal
