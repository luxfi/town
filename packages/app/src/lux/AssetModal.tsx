import { Modal } from 'react-morphing-modal'
import { HiOutlineChevronLeft } from 'react-icons/hi'

import Asset from './Asset'
import React, { useState } from 'react'
import { useAsset } from './state'
import How from './How'
import SetBid from './SetBid'
import SetAsk from './SetAsk'

const AssetModal = (props: any) => {
  const { modalProps, tokenId, type, height, image, video } = props
  const { ask, formattedBalance, isOwner, symbol } = useAsset(tokenId)

  const [showHow, setShowHow] = useState(false)

  return (
    <Modal {...props.modalProps} padding={0} closeButton={false}>
      <div className="grid md:grid-cols-2 gap-30 sm:grid-cols-1">
        <div className="">
          <div
            onClick={modalProps.close}
            className="flex items-center justify-center mt-5 ml-5 bg-gray-800 rounded-full shadow-2xl cursor-pointer md:absolute h-14 w-14"
          >
            <HiOutlineChevronLeft />
          </div>
          <div className="flex items-stretch md:h-screen">
            <div className="self-center m-auto w-96">
              <Asset tokenId={tokenId} type={type} showPrice image={image} video={video} autoPlay />
            </div>
          </div>
        </div>
        <div className="flex items-stretch bg-gray-900 md:h-screen">
          <div className="self-center m-auto w-96">
            {isOwner ? (
              <div>
                <SetAsk type={type} tokenId={tokenId}>
                  <div></div>
                </SetAsk>
              </div>
            ) : (
              <div>
                {showHow ? (
                  <How onClick={() => setShowHow(false)} />
                ) : (
                  <SetBid type={type} tokenId={tokenId}>
                    <div className="pt-3">
                      <p className="text-center">You cannot withdraw a reservation once submitted.</p>
                      <p className="text-center text-indigo-400 cursor-pointer" onClick={() => setShowHow(true)}>
                        How do reservations work?
                      </p>
                    </div>
                  </SetBid>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AssetModal
