import { withSentry } from '@sentry/nextjs'

function uppercase(s) {
  return s.charAt(0).toUpperCase() + s.substr(1)
}

function data(name, kind, amount) {
  return {
    name: name,
    description: 'LUX is a sovereign network of blockchains providing decentralized access to real world assets (RWAs).',
    external_url: `https://app.lux.market/0x31e0f919c67cedd2bc3e294340dc900735810311/`,
    image: `https://lux.town/nfts/${kind}.jpg`,
    animation_url: `https://lux.town/nfts/${kind}.mp4`,
    attributes: [
      {
        "trait_type": "Kind",
        "value": uppercase(kind)
      },
      {
        "trait_type": "Amount",
        "value": amount
      },
    ],
  }
}


const coinNames = {
  __wallet_10_b_lux__:  '10B Coin',
  __wallet_1_b_lux__:   '1B Coin',
  __wallet_100_m_lux__: '100M Coin',
  __wallet_10_m_lux__:  '10M Coin',
  __wallet_1_m_lux__:   '1M Coin'
}

function meta(query) {
  let kind  = query.kind.replace('.json', '')
  let name    = uppercase(kind)
  let amount  = 1

  switch (kind) {
    case 'validator':
      break;
    case 'wallet':
    case 'coin':
      kind   = 'coin'
      name   = coinNames[query.name]
      amount = parseInt(query.lux)
      break;
    case 'atm':
    case 'card':
    case 'credit':
      kind = 'card'
      name = 'Card'
      break;
  }

  return data(name, kind, amount)
}

const handler = async (req, res) => {
  return res.json(meta(req.query))
}

export default withSentry(handler)
