import Head from 'next/head'
import Mint from './mint'

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>
      <Mint />
    </div>
  )
}
