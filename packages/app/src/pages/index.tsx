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
import { gql, useQuery } from '@apollo/client'
import { useActiveWeb3React } from '../hooks'
import { useRouter } from 'next/router'

const GET_ASSETS = gql`
  query GetMedias {
    medias {
      id
      contentURI
      metadataHash
      owner {
        id
      }
    }
  }
`;

export default function Dashboard() {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const { tokenId } = router.query
  
  const {
    modalProps,
    open: openModal,
  } = useModal({
    background: 'black',
  })

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <AssetList
        title="My NFTs"
        where={{ owner: account }}
        perPage={24}
        openModal={openModal}
      />

      <AssetModal tokenId={tokenId} modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
