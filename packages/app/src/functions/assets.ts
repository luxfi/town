const ASSET_VALIDATOR = 'Validator'
const ASSET_ATM = 'ATM'
const ASSET_WALLET = 'Genesis Wallet'
const ASSET_CASH = 'Cash'

export const newAsset = (tokenId, type, props = {}) => {
  return {
    tokenId,
    type,
    ...props,
  }
}

export const getOwnedAssets = () => {
  return [
    newAsset(1, ASSET_VALIDATOR),
    newAsset(2, ASSET_ATM),
    newAsset(3, ASSET_WALLET),
    newAsset(4, ASSET_WALLET),
    newAsset(5, ASSET_WALLET),
    newAsset(6, ASSET_CASH),
  ]
}
