import Container from '../components/Container'
import Head from 'next/head'
import Card from '../components/Card'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Asset from '../lux/Asset'
import { useEffect, useState } from 'react'
import { getOwnedAssets } from '../functions/assets'

export default function Dashboard() {
  const [owned, setOwned] = useState([])

  useEffect(() => {
    setOwned(getOwnedAssets())
  }, [])

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="4xl">
      <Head>
        <title>Dashboard | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div>
        <h1>My Assets</h1>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-20 md:grid-cols-3 xl:grid-cols-3">
        {owned.map((asset) => (
          <Asset key={asset.tokenId} {...asset} />
        ))}
      </div>
    </Container>
  )
}
