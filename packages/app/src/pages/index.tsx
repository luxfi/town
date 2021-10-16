import Container from '../components/Container'
import Head from 'next/head'
import Card from '../components/Card'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Asset, { AssetProps } from '../lux/Asset'
import { useEffect, useRef, useState } from 'react'
import {
  getOwnedNfts,
  getValidatorNfts,
  getAtmNfts,
  getWalletNfts,
  getCashNfts,
  TYPE_VALIDATOR,
  TYPE_WALLET,
} from '../functions/assets'
import AssetModal from '../lux/AssetModal'
import { useModal } from 'react-morphing-modal'
import AssetList from '../lux/AssetList'

const listTypes = [{ type: 'Validator' }, { type: 'ATM' }, { type: 'Wallet' }]

export default function Dashboard() {
  const [ownedNfts, setOwnedNfts] = useState([])
  const [validatorNfts, setValidatorNfts] = useState([])
  const [atmNfts, setAtmNfts] = useState([])
  const [walletNfts, setWalletNfts] = useState([])
  // const [cashNfts, setCashNfts] = useState([])
  const [selectedNft, setSelectedNft] = useState(null)

  const [typeNfts, setTypeNfts] = useState({
    Validator: [],
    ATM: [],
    Wallet: [],
  })

  const onLoadAssets = (type, assets: object[]) => {
    setTypeNfts((typeNfts) => ({ ...typeNfts, [type]: assets }))
  }

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

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      {listTypes.map((list) => (
        <AssetList
          tokenType={list.type}
          tokenName={list.type}
          getTriggerProps={getTriggerProps}
          onLoadAssets={(assets) => onLoadAssets(list.type, assets)}
        />
      ))}

      <AssetModal {...selectedNft} modalProps={modalProps} />
    </Container>
  )
}
