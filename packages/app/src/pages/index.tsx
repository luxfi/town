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
} from '../functions/assets'
import AssetModal from '../lux/AssetModal'
import { useModal } from 'react-morphing-modal'
import AssetList from '../lux/AssetList'

export default function Dashboard() {
  const [ownedNfts, setOwnedNfts] = useState([])
  const [validatorNfts, setValidatorNfts] = useState([])
  const [atmNfts, setAtmNfts] = useState([])
  const [walletNfts, setWalletNfts] = useState([])
  // const [cashNfts, setCashNfts] = useState([])
  const [selectedNft, setSelectedNft] = useState(null)

  const { modalProps, getTriggerProps, activeModal } = useModal({
    background: 'black',
  })

  console.log(activeModal)

  // const onAssetClick = (asset: AssetProps) => {
  //   open(modalRef, {
  //     id: asset.tokenId,
  //   })
  // }

  useEffect(() => {
    setOwnedNfts(getOwnedNfts())
    setValidatorNfts(getValidatorNfts())
    setAtmNfts(getAtmNfts())
    setWalletNfts(getWalletNfts())
    // setCashNfts(getCashNfts())
  }, [])

  useEffect(() => {
    const nft = [...ownedNfts, ...validatorNfts, ...atmNfts, ...walletNfts].filter(
      (asset) => asset.tokenId === activeModal
    )[0]

    setSelectedNft(nft)
  }, [activeModal])

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="6xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div className="mb-10 border-2 border-gray-700 rounded">
        <div className="text-xl text-center text-gray-600 bg-black AssetList__heading bottom-5">Owned NFTs</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {ownedNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={getTriggerProps} />
          ))}
        </div>
      </div>

      {/* <AssetList tokenType={TYPE_VALIDATOR} tokenName="Validator" getTriggerProps={getTriggerProps} /> */}

      <div className="mb-10">
        <div className="text-xl text-center text-gray-600">Validators</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {validatorNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={getTriggerProps} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div className="text-xl text-center text-gray-600">ATMs</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {atmNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={getTriggerProps} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div className="text-xl text-center text-gray-600">Genesis Wallets</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {walletNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={getTriggerProps} />
          ))}
        </div>
      </div>
      {/* <div className="mb-10">
        <div className="text-xl text-center text-gray-600">Cash</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {cashNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={getTriggerProps} />
          ))}
        </div>
      </div> */}
      <AssetModal {...selectedNft} modalProps={modalProps} />
    </Container>
  )
}
