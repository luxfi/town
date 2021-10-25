import Container from '../components/Container'
import Head from 'next/head'
import Card from '../components/Card'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Asset, { AssetProps } from '../lux/Asset'
import { useEffect, useRef, useState } from 'react'
import { TYPE_VALIDATOR, TYPE_WALLET } from '../functions/assets'
import AssetModal from '../lux/AssetModal'
import { useModal } from 'react-morphing-modal'
import AssetList from '../lux/AssetList'
import { useActiveWeb3React } from '../hooks'
import BidList from '../lux/BidList'
import BidModal from '../lux/BidModal'
import { GraphBid } from '../lux/types'
import AskList from '../lux/AskList'
import { useBids, useTokenTypes } from '../lux/state'

export default function Dashboard() {
  const { account } = useActiveWeb3React()
  const [showBidModal, setShowBidModal] = useState(false)
  const [modalBid, setModalBid] = useState(null)
  const { tokenAggregates } = useTokenTypes()
  const { modalProps, open: openModal } = useModal({
    background: 'black',
  })
  
  const onClickBid = (bid: GraphBid) => {
    setModalBid(bid)
    setShowBidModal(true)
  }

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <AssetList
        title="My NFTs"
        where={{ owner: account }}
        perPage={6}
        cols={6}
        totalMinted={tokenAggregates.minted}
        showPageNumbers={false}
      />
      <div className="grid grid-cols-2 gap-16">
        <div className="">
          <div className="text-2xl text-indigo-600">My Bids</div>
          <BidList where={{ bidder: account }} onClick={onClickBid} showToken />
        </div>
        <div className="">
          <div className="text-2xl text-indigo-600">My Asks</div>
          <AskList where={{ owner: account }} showToken />
        </div>
      </div>
      <BidModal bid={modalBid} isOpen={showBidModal} onClose={() => setShowBidModal(false)} />
      <AssetModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
