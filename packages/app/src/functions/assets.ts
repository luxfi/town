import { ChainId } from '@luxdefi/sdk'
import _ from 'lodash'
import ipfsFiles from '../constants/ipfs'

export const TYPE_VALIDATOR = 'Validator'
export const TYPE_ATM = 'ATM'
export const TYPE_WALLET = 'Wallet'
export const TYPE_CASH = 'Cash'

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
  return [newNft(1, TYPE_VALIDATOR), newNft(2, TYPE_ATM), newNft(3, TYPE_WALLET)]
}

export const getValidatorNfts = () => {
  return _.times(6, (n) => newNft(n + 1, TYPE_VALIDATOR))
}

export const getAtmNfts = () => {
  return _.times(6, (n) => newNft(n + 7, TYPE_ATM))
}

export const getWalletNfts = () => {
  return _.times(6, (n) => newNft(n + 13, TYPE_WALLET))
}

export const getCashNfts = () => {
  return _.times(6, (n) => newNft(n + 20, TYPE_CASH))
}
