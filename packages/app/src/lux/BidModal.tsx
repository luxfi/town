import {
  AVAILABLE_NETWORKS,
  DEFAULT_METAMASK_CHAIN_ID,
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../config/networks'
import Image from 'next/image'
import Modal from '../components/Modal'
import ModalHeader from '../components/ModalHeader'
import React, { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { getContent, usePrice } from './state'
import { formatCurrencyAmountWithCommas, isSameAddress, shortenAddress } from '../functions'
import { RemoveBidButton } from './RemoveBidButton'
import { getAddress } from 'ethers/lib/utils'
import { useContract } from '../hooks'
import Account from './Account'
import { getCurrencyTokenLowerCase } from '../config/currencies'
import { Currency, Token, ZERO_ADDRESS } from '@luxdefi/sdk'
import BidItem from './BidItem'

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

  if (!bid) return <></>

  const { type } = getContent(bid.media?.contentURI)
  const bidder = bid.bidder?.id
  const currency = bid.currency?.id
  const tokenId = bid.media?.id

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxWidth={672}>
      <ModalHeader onClose={onClose} title={`Placed a bid on ${type} ${tokenId}`} />

      <BidItem bid={bid} />

      <div className="pt-5">
        {!offline && isSameAddress(account, bidder) && (
          <div className="p-3 text-center bg-black rounded">If the bid is removed, the bidder address will be refunded.</div>
        )}
      </div>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-5 pt-5 overflow-y-auto md:grid-cols-2">
        <div></div>
        <div>
          {isSameAddress(account, bidder) && (
            <RemoveBidButton tokenId={tokenId} tokenType={type} currency={currency} onError={onClose} />
          )}
        </div>
      </div>
    </Modal>
  )
}
