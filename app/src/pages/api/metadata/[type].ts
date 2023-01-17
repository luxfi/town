import { withSentry } from '@sentry/nextjs'

const validator_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/validator.jpg',
  animation_url: 'https://lux.town/nfts/validator.mp4',
  name: 'Validator',
  attributes: [
    {
      "trait_type": "Kind",
      "value": "Validator"
    },
    {
      "trait_type": "Amount",
      "value": 1
    },
  ],
}

const card_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/card.jpg',
  animation_url: 'https://lux.town/nfts/card.mp4',
  name: 'Card',
  attributes: [
    {
      "trait_type": "Kind",
      "value": "Card"
    },
    {
      "trait_type": "Amount",
      "value": 1
    },
  ],
}

const coin_metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/1',
  image: 'https://lux.town/nfts/coin.jpg',
  animation_url: 'https://lux.town/nfts/coin.mp4',
  name: 'Coin',
}


const handler = async (req, res) => {
  const type = req.query.type.replace('.json', '')
  switch (type) {
    case 'validator':
      return res.json(validator_metadata)
    case 'wallet':
    case 'coin':
      const amount = parseInt(req.query.lux)
      const attrs = [
        {
          "trait_type": "Kind",
          "value": "Coin"
        },
        {
          "trait_type": "Amount",
          "value": amount
        }
      ]
      return res.json(Object.assign(coin_metadata, {attributes: attrs}))
    case 'atm':
    case 'card':
    case 'credit':
      return res.json(card_metadata)
  }

  res.json(validator_metadata)
}

export default withSentry(handler)
