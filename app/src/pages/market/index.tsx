import _ from 'lodash'
import Head from 'next/head'
import { useModal } from 'react-morphing-modal'
import Container from '../../components/Container'
import AssetModal from '../../lux/AssetModal'
import AssetList from '../../lux/AssetList'
import { useTokenTypes } from '../../lux/state'

export default function Market() {
  const { modalProps, open: openModal } = useModal({
    background: 'black',
  })

  const { tokenTypes } = useTokenTypes();

  return (
    <Container id="market-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>LUX Town | Market</title>
        <meta name="description" content="Lux Town" />
      </Head>

      {tokenTypes.map((tokenType) => (
        <AssetList
          key={tokenType.name}
          title={tokenType.name}
          tokenType={tokenType.name}
          tokenName={tokenType.name}
          totalMinted={tokenType.minted}
          where={{ metadataURI_contains: `name=__${_.snakeCase(tokenType.name)}__` }}
          perPage={6}
        />
      ))}

      <AssetModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
