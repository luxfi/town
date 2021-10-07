import Container from '../components/Container'
import Head from 'next/head'
import Card from '../components/Card'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Asset from '../lux/Asset'
import { useEffect, useState } from 'react'
import { getOwnedNfts, getValidatorNfts, getAtmNfts, getWalletNfts, getCashNfts } from '../functions/assets'

export default function Dashboard() {
  const [ownedNfts, setOwnedNfts] = useState([])
  const [validatorNfts, setValidatorNfts] = useState([])
  const [atmNfts, setAtmNfts] = useState([])
  const [walletNfts, setWalletNfts] = useState([])
  const [cashNfts, setCashNfts] = useState([])

  useEffect(() => {
    setOwnedNfts(getOwnedNfts())
    setValidatorNfts(getValidatorNfts())
    setAtmNfts(getAtmNfts())
    setWalletNfts(getWalletNfts())
    setCashNfts(getCashNfts())
  }, [])

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="4xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div className="mb-10">
        <div>
          <h2 className="mb-10 text-xl text-center text-gray-600">Owned NFTs</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {ownedNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div>
          <h2 className="mb-10 text-xl text-center text-gray-600">Validators</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {validatorNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div>
          <h2 className="mb-10 text-xl text-center text-gray-600">ATMs</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {atmNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div>
          <h2 className="mb-10 text-xl text-center text-gray-600">Genesis Wallets</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {walletNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <div>
          <h2 className="mb-10 text-xl text-center text-gray-600">Cash</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {cashNfts.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} />
          ))}
        </div>
      </div>
    </Container>
  )
}
