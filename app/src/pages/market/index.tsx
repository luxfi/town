import Container from '../../components/Container'
import Head from 'next/head'

export default function Market() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Market | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>
    </Container>
  )
}
