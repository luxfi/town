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

      <AssetList title="My NFTs" where={{ owner: account }} perPage={24} cols={6} openModal={openModal} />
      <div className="grid grid-cols-2">
        <div className="pr-5">
          <div className="text-2xl text-indigo-600">My Bids</div>
          <BidList where={{ bidder: account }} showToken />
        </div>
        <div>
        </div>
      </div>

      <AssetModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
