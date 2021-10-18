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
import { request } from 'graphql-request'

const listTypes = [
  { type: 'Validator', name: 'Validator' },
  { type: 'ATM', name: 'ATM' },
  { type: 'Wallet', name: 'Wallet' },
]

const GET_ASSETS = gql`
query GetMedias {
	medias {
    id
    transfers {
      id
      createdAtTimestamp
      from {
        id
      }
      to {
        id
        
      }
    }
    owner {
      id
      
    }
    metadataHash
    contentURI
    currentAsk {
      currency {
        id
      }
      amount
    }
		currentBids {
      amount
    }
  }
}
`;

export default function Dashboard() {

  const [selectedNft, setSelectedNft] = useState(null)

  const [typeNfts, setTypeNfts] = useState({
    Validator: [],
    ATM: [],
    Wallet: [],
  })
  
  const {
    modalProps,
    getTriggerProps,
    activeModal: tokenId,
  } = useModal({
    background: 'black',
  })
  
  useEffect(() => {
    const nft = listTypes
    .map((list) => typeNfts[list.type])
    .flat()
    .filter((asset) => asset.tokenId === tokenId)[0]
    
    setSelectedNft(nft)
  }, [tokenId])
  
  const onLoadAssets = (type, assets: object[]) => {
    setTypeNfts((typeNfts) => ({ ...typeNfts, [type]: assets }))
  }

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      {listTypes.map((list) => (
        <AssetList
          key={list.name}
          tokenType={list.type}
          tokenName={list.name}
          getTriggerProps={getTriggerProps}
          onLoadAssets={(assets) => onLoadAssets(list.type, assets)}
        />
      ))}

      <AssetModal {...selectedNft} modalProps={modalProps} />
    </Container>
  )
}
