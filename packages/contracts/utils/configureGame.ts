// Generated from Yield Matrix spreadsheet (see: `yarn matrix`)
import rarities from './rarities.json'
import animals from './animals.json'
import hybrids from './hybrids.json'

enum LuxType {
  VALIDATOR = 0,
  ATM = 1,
  WALLET = 2,
  CASH = 3,
}

// Configure game for our Gen 0 drop
export default async function configureGame(app: any, drop: any) {
  // Add Drop to ZooKeeper
  await app.addDrop(drop.address)

  // Configure Drop
  await drop.configure(app.address)

  // Add tokenType
  const tokenType = [
    {
      kind: LuxType.VALIDATOR,
      name: 'Validator',
      price: 360000,
      supply: 18000,
      tokenURI: 'https://db.zoolabs/egg.jpg',
      metadataURI: 'https://db.zoolabs.org/egg.json',
    },
    {
      kind: LuxType.ATM,
      name: 'ATM',
      price: 360000,
      supply: 18000,
      tokenURI: 'https://db.zoolabs/hybrid.jpg',
      metadataURI: 'https://db.zoolabs.org/hybrid.json',
    },
  ]

  tokenType.map(async (t) => {
    await drop.setTokenType(t.kind, t.name, t.price, t.supply, t.tokenURI, t.metadataURI)
  })
}
