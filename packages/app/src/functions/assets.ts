import _ from 'lodash'

const NFT_VALIDATOR = 'Validator'
const NFT_ATM = 'ATM'
const NFT_WALLET = 'Genesis Wallet'
const NFT_CASH = 'Cash'

export const newNft = (tokenId, type, props = {}) => {
  return {
    tokenId,
    type,
    ...props,
  }
}

export const getOwnedNfts = () => {
  return [newNft(1, NFT_VALIDATOR), newNft(2, NFT_ATM), newNft(3, NFT_WALLET), newNft(4, NFT_CASH)]
}

export const getValidatorNfts = () => {
  return _.times(4, (n) => newNft(n + 1, NFT_VALIDATOR))
}

export const getAtmNfts = () => {
  return _.times(4, (n) => newNft(n + 1, NFT_ATM))
}

export const getWalletNfts = () => {
  return _.times(4, (n) => newNft(n + 1, NFT_WALLET))
}

export const getCashNfts = () => {
  return _.times(4, (n) => newNft(n + 1, NFT_CASH))
}
