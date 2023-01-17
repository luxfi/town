import _ from "lodash";
import Head from "next/head";
import { useModal } from "react-morphing-modal";
import Container from "../../components/Container";
import AssetSaleModal from "../../lux/AssetSaleModal";
import AssetList from "../../lux/AssetList";
import { useTokenTypes } from "../../lux/state";
import AssetSale from "../../lux/AssetSale";
import { useRouter } from "next/router";

const DROP_ID = 1;
const BASE_NFT_URL = "https://lux.town/nfts";

const getTypeURIs = (type: string) => {
  return {
    contentURI: BASE_NFT_URL + `/${type}.mp4?type=__${type}__`,
    metadataURI: BASE_NFT_URL + `/api/metadata/${type}.json?type=__${type}__`,
  };
};

const tokenTypesMap = {
  VALIDATOR: {
    name: "Validator",
    ...getTypeURIs("validator"),
  },
  WALLET_10B_LUX: {
    name: "Wallet 10B Lux",
    ...getTypeURIs("wallet"),
  },
  WALLET_1B_LUX: {
    name: "Wallet 1B Lux",
    ...getTypeURIs("wallet"),
  },
  WALLET_100M_LUX: {
    name: "Wallet 100M Lux",
    ...getTypeURIs("wallet"),
  },
  WALLET_10M_LUX: {
    name: "Wallet 10M Lux",
    ...getTypeURIs("wallet"),
  },
  WALLET_1M_LUX: {
    name: "Wallet 1M Lux",
    ...getTypeURIs("wallet"),
  },
  WALLET_ATM_LUX: {
    name: "ATM",
    ...getTypeURIs("atm"),
  },
};

export default function Mint() {
  const router = useRouter();
  const { tokenTypes } = useTokenTypes();
  const { modalProps, open: openModal } = useModal({
    background: "black",
  });

  // console.log('Mint', tokenTypes)

  const onClickTokenType = (name: string) => {
    console.log("name", name);
    router.push(`${router.pathname}?name=${name}`, undefined, {
      shallow: true,
    });
  };

  return (
    <Container
      id="mint-page"
      className="py-4 md:py-8 lg:py-12 "
      maxWidth="6xl"
    >
      <Head>
        <title>Mint | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div className={`grid grid-cols-1 gap-5 md:grid-cols-4`}>
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.VALIDATOR}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_10B_LUX}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_1B_LUX}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_100M_LUX}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_10M_LUX}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_1M_LUX}
          onClickTokenType={onClickTokenType}
        />
        <AssetSale
          dropId={DROP_ID}
          {...tokenTypesMap.WALLET_ATM_LUX}
          onClickTokenType={onClickTokenType}
        />
      </div>

      <AssetSaleModal modalProps={modalProps} openModal={openModal} />
    </Container>
  );
}
