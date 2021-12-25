import Modal from '../components/Modal'
import ModalHeader from '../components/ModalHeader'
import React, { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { getContent, usePrice } from './state'
import { formatCurrencyAmountWithCommas, isSameAddress, shortenAddress } from '../functions'
import { RemoveBidButton } from './RemoveBidButton'
import { useContract } from '../hooks'
import BidItem from './BidItem'
import { AcceptBidButton } from './AcceptBidButton'

export default function BidModal({ bid, isOpen, onClose }): JSX.Element | null {
  const { account } = useActiveWeb3React()
  const [offline, setOffline] = useState(false)
  const market = useContract('Market')

  useEffect(() => {
    if (bid?.media?.id) {
      market.bidForTokenBidder(bid?.media?.id, account).then((bid) => {
        setOffline(bid.offline)
      })
    }
  }, [bid])

  const { type, given_name } = getContent(bid?.media?.contentURI)
  const bidder = bid?.bidder?.id
  const owner = bid?.media?.owner?.id
  const currency = bid?.currency?.id
  const tokenId = bid?.media?.id

  const isBidder = useCallback((account: string) => {
    if (!account || !bidder) {
      return false
    }
    return isSameAddress(account, bidder)
  }, [bidder])

  const isOwner = useCallback((account: string) => {
    if (!account || !owner) {
      return false
    }
    return isSameAddress(account, owner)
  }, [owner])

  if (!bid) return <></>

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxWidth={672}>
      <ModalHeader onClose={onClose} title={`Bid for ${given_name || type} ${tokenId}`} />

      <BidItem bid={bid} />

      <div className="pt-5">
        {!offline && isSameAddress(account, bidder) && (
          <div className="p-3 text-center bg-black rounded">If the bid is removed, the bidder address will be refunded.</div>
        )}
      </div>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-5 pt-5 overflow-y-auto md:grid-cols-2">
        <div></div>
        <div>
          {isBidder(account) && (
            <RemoveBidButton tokenId={tokenId} tokenType={type} currency={currency} onRemove={onClose} onError={onClose} />
          )}
          {isOwner(account) && bid && (
            <AcceptBidButton bidder={bidder} tokenId={tokenId} tokenType={type} onAccept={onClose} onError={onClose} />
          )}
        </div>
      </div>
    </Modal>
  )
}
