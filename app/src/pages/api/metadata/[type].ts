import { withSentry } from '@sentry/nextjs'

const metadata = {
  description: 'Lux NFTs give you access to the Lux network at launch.',
  external_url: 'https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311',
  image: 'https://lux.town/nfts/validator.jpg',
  animation_url: 'https://lux.town/nfts/validator.mp4'
  name: 'Validator',
  attributes: [],
}

const handler = async (req, res) => {
  // const type = req.query.type.replace('.json')
  // switch (type) {
  //   case 'validator': {

  //   }
  // }

  res.json(metadata)
}

export default withSentry(handler)
