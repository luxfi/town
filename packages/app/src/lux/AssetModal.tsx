import { useRouter } from 'next/router'
import { Modal } from 'react-morphing-modal'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import Asset from './Asset'
import React, { useEffect, useRef, useState } from 'react'
import { useAsset } from './state'
import HowReservations from './HowReservations'
import SetBid from './SetBid'
import SetAsk from './SetAsk'
import HowOffline from './HowOffline'
import BidList from './BidList'
import { Bid, GraphBid } from './types'
import BidModal from './BidModal'

const defaultShow = {
  setAsk: false,
  setBid: false,
  howReservations: false,
  howOffline: false,
}

const NoBids = () => <div>Be the first to place a bid.</div>

const NoAsks = () => <div>Be the first to place a bid.</div>

const AssetModal = (props: any) => {
  const router = useRouter()
  const assetModalRef = useRef(null)
  const { tokenId: routerTokenId } = router.query
  const { modalProps } = props
  const [tokenId, setTokenId] = useState(null)
  const { ask, highest, getUsdAmount, contentURI, formattedAmount, isOwner, symbol, usdAmount } = useAsset(tokenId)
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
    setTokenId(routerTokenId)
    if (routerTokenId) {
      props.openModal && props.openModal(assetModalRef, { id: routerTokenId })
    }
  }, [routerTokenId])

  const onClickBid = (bid: GraphBid) => {
    setModalBid(bid)
    setShowBidModal(!showBidModal)
  }
  console.log('hello')

  return (
    <>
      <BidModal bid={modalBid} isOpen={showBidModal} onClose={() => setShowBidModal(!showBidModal)} />
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
                <Asset
                  ask={ask}
                  tokenId={tokenId}
                  contentURI={contentURI}
                  formattedAmount={formattedAmount}
                  usdAmount={usdAmount}
                  getUsdAmount={getUsdAmount}
                  highest={highest}
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
                      <SetAsk tokenId={tokenId}>
                        {/* <p className="text-center">You cannot withdraw a reservation once submitted.</p> */}
                        <p
                          className="pt-8 text-center text-gray-500 cursor-pointer"
                          onClick={() => showSection('howOffline')}
                        >
                          How do offline asks work?
                        </p>
                      </SetAsk>
                      <div className="pt-8 text-indigo-500">Bids</div>
                      <BidList where={{ media: tokenId }} onClick={onClickBid} />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {show.howReservations ? (
                    <HowReservations onClick={() => showSection('setBid')} />
                  ) : (
                    <>
                      <SetBid tokenId={tokenId}>
                        <p
                          className="pt-8 text-center text-gray-500 cursor-pointer"
                          onClick={() => showSection('howReservations')}
                        >
                          How do reservations work?
                        </p>
                      </SetBid>
                      <div className="pt-8 text-indigo-500">Bids</div>
                      <BidList empty={<NoBids />} where={{ media: tokenId }} onClick={onClickBid} />
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
