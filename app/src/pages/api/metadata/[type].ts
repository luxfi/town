import { withSentry } from '@sentry/nextjs'

const validator_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/validator.jpg',
  animation_url: 'https://lux.town/nfts/validator.mp4',
  name: 'Validator',
  attributes: [],
}

const wallet_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/coin.jpg',
  animation_url: 'https://lux.town/nfts/coin.mp4',
  name: 'Coin',
  attributes: [],
}

const atm_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/card.jpg',
  animation_url: 'https://lux.town/nfts/card.mp4',
  name: 'Card',
  attributes: [],
}

const handler = async (req, res) => {
  const type = req.query.type.replace('.json', '')
  switch (type) {
    case 'validator':
      return res.json(validator_metadata)
    case 'wallet':
      return res.json(wallet_metadata)
    case 'atm':
      return res.json(atm_metadata)
  }

  res.json(validator_metadata)
}

export default withSentry(handler)
