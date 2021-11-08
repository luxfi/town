import { useRouter } from 'next/router'
import { Modal } from 'react-morphing-modal'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import AssetSale from './AssetSale'
import React, { useEffect, useRef, useState } from 'react'
import { useTokenType } from './state'
import HowReservations from './HowReservations'
import SetSaleBid from './SetSaleBid'
import LazySetAsk from './LazySetAsk'
import HowOffline from './HowOffline'
import LazyBidList from './LazyBidList'
import { Bid, GraphLazyBid } from './types'
import LazyBidModal from './LazyBidModal'

const defaultShow = {
  setAsk: false,
  setBid: false,
  howReservations: false,
  howOffline: false,
}

const NoBids = () => (
  <div>
    Be the first to place a bid.
  </div>
)

const NoAsks = () => (
  <div>
    Be the first to place a bid.
  </div>
)

const DROP_ID = 1

const AssetModal = (props: any) => {
  const router = useRouter()
  const assetModalRef = useRef(null)
  const { name: tokenTypeName } = router.query
  const { modalProps } = props
  const [tokenId, setTokenTypeName] = useState(null)
  // const { ask, highest, getUsdAmount, contentURI, formattedAmount, isOwner, symbol, usdAmount } = {} as any
  const { ask, highest, getUsdAmount, contentURI, metadataURI, formattedAmount, isOwner, symbol, usdAmount } = useTokenType(props.dropId, tokenTypeName as string)
  const [show, setShow] = useState(defaultShow)
  const [showBidModal, setShowBidModal] = useState(false)
  const [modalBid, setModalBid] = useState(null)

  const showSection = (section) => {
    setShow({ ...defaultShow, [section]: true })
  }

  const onClose = () => {
    router.push(router.pathname)
    modalProps.close()
  }

  useEffect(() => {
    setTokenTypeName(tokenTypeName)
    if (tokenTypeName) {
      props.openModal && props.openModal(assetModalRef, { id: tokenTypeName })
    }
  }, [tokenTypeName])

  const onClickBid = (bid: GraphLazyBid) => {
    setModalBid(bid)
    setShowBidModal(!showBidModal)
  }

  return (
    <>
      <LazyBidModal dropId={DROP_ID} name={tokenTypeName as string} bid={modalBid} isOpen={showBidModal} onClose={() => setShowBidModal(!showBidModal)} />
      <Modal {...props.modalProps} padding={0} closeButton={false}>
        <div ref={assetModalRef} className="grid md:grid-cols-2 gap-30 sm:grid-cols-1">
          <div className="">
            <div
              onClick={onClose}
              className="flex items-center justify-center mt-5 ml-5 bg-gray-800 rounded-full shadow-2xl cursor-pointer md:absolute h-14 w-14"
            >
              <HiOutlineChevronLeft />
            </div>
            <div className="flex items-stretch md:h-screen">
              <div className="self-center m-auto w-96">
                <AssetSale
                  ask={ask}
                  dropId={DROP_ID}
                  name={tokenTypeName as string}
                  contentURI={contentURI}
                  metadataURI={metadataURI}
                  formattedAmount={formattedAmount}
                  usdAmount={usdAmount}
                  getUsdAmount={getUsdAmount}
                  highest={highest as any}
                  symbol={symbol}
                  isOwner={isOwner}
                  showPrice
                  large
                  onClickBid={onClickBid}
                />
              </div>
            </div>
          </div>
          <div className="flex items-stretch bg-gray-900 md:h-screen">
            <div className="self-center m-auto w-96">
              {isOwner ? (
                <div>
                  {show.howOffline ? (
                    <HowOffline onClick={() => showSection('setAsk')} />
                  ) : (
                    <>
                      <LazySetAsk dropId={DROP_ID} name={tokenTypeName as string}>
                        <p
                          className="pt-8 text-center text-gray-500 cursor-pointer"
                          onClick={() => showSection('howOffline')}
                        >
                          How do offline asks work?
                        </p>
                      </LazySetAsk>
                      <div className="pt-8 text-indigo-500">Bids</div>
                      <LazyBidList empty={<NoBids />} where={{ tokenTypeName: tokenTypeName as string}} onClick={onClickBid} />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {show.howReservations ? (
                    <HowReservations onClick={() => showSection('setBid')} />
                  ) : (
                    <>
                      <SetSaleBid dropId={DROP_ID} name={tokenTypeName as string}>
                        <p
                          className="pt-8 text-center text-gray-500 cursor-pointer"
                          onClick={() => showSection('howReservations')}
                        >
                          How do reservations work?
                        </p>
                      </SetSaleBid>
                      <div className="pt-8 text-indigo-500">Bids</div>
                      <LazyBidList empty={<NoBids />} where={{ tokenTypeName: tokenTypeName as string}} onClick={onClickBid} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AssetModal
