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

export default function Dashboard() {
  const { account } = useActiveWeb3React()
  const { modalProps, open: openModal } = useModal({
    background: 'black',
  })

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div className="grid grid-cols-2">
        <div>
          <BidList title="My Bids" where={{ bidder: account }} />
        </div>
        <div>
          <AssetList title="My NFTs" where={{ owner: account }} perPage={24} cols={3} openModal={openModal} />
        </div>
      </div>

      <AssetModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
