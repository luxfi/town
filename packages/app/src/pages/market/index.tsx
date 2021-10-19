import Container from '../../components/Container'
import Head from 'next/head'
import Card from '../../components/Card'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Asset, { AssetProps } from '../../lux/Asset'
import { useEffect, useRef, useState } from 'react'
import { TYPE_VALIDATOR, TYPE_WALLET } from '../../functions/assets'
import AssetModal from '../../lux/AssetModal'
import { useModal } from 'react-morphing-modal'
import AssetList, { ContentUriFilter } from '../../lux/AssetList'
import { gql, useQuery } from '@apollo/client'
import { request } from 'graphql-request'

const listTypes = [
  { type: 'Validator', name: 'Validator' },
  { type: 'ATM', name: 'ATM' },
  { type: 'Wallet', name: 'Wallet' },
]

const map = {
  ATM: ContentUriFilter.ATM,
  Wallet: ContentUriFilter.WALLET,
  Validator: ContentUriFilter.VALIDATOR,
}

const GET_ASSETS = gql`
  query GetAssets {
    medias {
      id
      contentURI
      metadataHash
      owner {
        id
      }
    }
  }
`

export default function Market() {
  const { modalProps, open: openModal } = useModal({
    background: 'black',
  })

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      {listTypes.map((list) => (
        <AssetList
          key={list.name}
          title={list.name}
          tokenType={list.type}
          tokenName={list.name}
          where={{ contentURI_contains: map[list.type] }}
          perPage={6}
        />
      ))}

      <AssetModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
