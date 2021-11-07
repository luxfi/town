import _ from 'lodash'
import Head from 'next/head'
import { useModal } from 'react-morphing-modal'
import Container from '../../components/Container'
import AssetSaleModal from '../../lux/AssetSaleModal'
import AssetList from '../../lux/AssetList'
import { useTokenTypes } from '../../lux/state'
import AssetSale from '../../lux/AssetSale'
import { useRouter } from 'next/router'

const DROP_ID = 1
const BASE_NFT_URL = 'https://lux.town/nfts'

const tokenTypesMap = {
    VALIDATOR: {
        name: 'Validator',
        contentURI: BASE_NFT_URL + '/validator.mp4?type=__validator__',
        metadataURI: BASE_NFT_URL + '/api/metadata/validator.json?type=__validator__',
        // ask: {
        //     currency: ,

        // }
    }
}

export default function Sale() {
  const router = useRouter()
  const { modalProps, open: openModal } = useModal({
    background: 'black',
  })

  const onClickTokenType = (name: string) => {
    router.push(`${router.pathname}?name=${name}`, undefined, { shallow: true })
  }

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Sale | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div>
        {/* {tokenTypes.map((tokenType) => ( */}
          {/* <AssetSale key={`${tokenType.dropId}-${tokenType.name}`} dropId={tokenType.dropId} tokenTypeName={tokenType.name} contentURI={tokenType.contentURI} /> */}
        {/* ))} */}
      </div>

      <div className={`grid grid-cols-1 gap-5 md:grid-cols-6`}>
          <AssetSale dropId={DROP_ID} {...tokenTypesMap.VALIDATOR} onClickTokenType={onClickTokenType} />
        </div>


      {/* {tokenTypes.map((tokenType) => (
        <AssetList
          key={tokenType.name}
          title={tokenType.name}
          tokenType={tokenType.name}
          tokenName={tokenType.name}
          totalMinted={tokenType.minted}
          where={{ metadataURI_contains: `name=__${_.snakeCase(tokenType.name)}__` }}
          perPage={6}
        />
      ))} */}

      <AssetSaleModal modalProps={modalProps} openModal={openModal} />
    </Container>
  )
}
