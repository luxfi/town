import { ChainId } from '@luxdefi/sdk'
import _ from 'lodash'
import ipfsFiles from '../constants/ipfs'

export const NFT_VALIDATOR = 'Validator'
export const NFT_ATM = 'ATM'
export const NFT_WALLET = 'Wallet'
export const NFT_CASH = 'Cash'

export const newNft = (tokenId, type, props = {}) => {
  return {
    tokenId,
    type,
    image: `/nfts/${type.toLowerCase()}.gif`,
    video: `/nfts/${type.toLowerCase()}.mp4`,
    ...props,
  }
}

export const getOwnedNfts = () => {
  return [newNft(1, NFT_VALIDATOR), newNft(2, NFT_ATM), newNft(3, NFT_WALLET)]
}

export const getValidatorNfts = () => {
  return _.times(6, (n) => newNft(n + 1, NFT_VALIDATOR))
}

export const getAtmNfts = () => {
  return _.times(6, (n) => newNft(n + 7, NFT_ATM))
}

export const getWalletNfts = () => {
  return _.times(6, (n) => newNft(n + 13, NFT_WALLET))
}

export const getCashNfts = () => {
  return _.times(6, (n) => newNft(n + 20, NFT_CASH))
}
