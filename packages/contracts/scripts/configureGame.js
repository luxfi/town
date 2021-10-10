const hre = require('hardhat')
const ethers = hre.ethers

const NETWORK = process.env.HARDHAT_NETWORK ? process.env.HARDHAT_NETWORK : 'hardhat'

console.log(`Configure game on ${NETWORK}`)

const DEPLOYMENT = {
  hardhat: 'localhost',
  testnet: 'testnet',
  mainnet: 'mainnet',
  ethereum: 'ethereum',
  rinkeby: 'rinkeby',
  ropsten: 'ropsten',
}[NETWORK]

const rarities = require('../utils/rarities.json')
const animals = require('../utils/animals.json')
const hybrids = require('../utils/hybrids.json')

const ZOO = require(`../deployments/${DEPLOYMENT}/ZOO.json`)
const Market = require(`../deployments/${DEPLOYMENT}/Market.json`)
const Media = require(`../deployments/${DEPLOYMENT}/Media.json`)
const Drop = require(`../deployments/${DEPLOYMENT}/Drop.json`)
const ZooKeeper = require(`../deployments/${DEPLOYMENT}/ZooKeeper.json`)
const bridge = require(`../deployments/${DEPLOYMENT}/Bridge.json`)

// Split game data into deploy-sized chunks
function chunks(arr, size) {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size)
    res.push(chunk)
  }
  return res
}

async function main() {
  const [signer] = await ethers.getSigners()

  const keeper = await (await ethers.getContractAt('ZooKeeper', ZooKeeper.address)).connect(signer)
  const drop = await (await ethers.getContractAt('Drop', Drop.address)).connect(signer)
  const media = await (await ethers.getContractAt('Media', Media.address)).connect(signer)
  const market = await (await ethers.getContractAt('Market', Market.address)).connect(signer)

  // Configure Market
  console.log('market.configure', Media.address)
  await market.configure(Media.address)

  // Configure Media
  console.log('media.configure', Market.address)
  await media.configure(Market.address)

  // Configure game for our Gen 0 drop
  console.log('keeper.configure', Media.address, ZOO.address)
  await keeper.configure(Media.address, ZOO.address, bridge.address, true)

  // Configure Drop
  console.log('drop.configure', keeper.address)
  await drop.configureKeeper(keeper.address)

  // Setup Gen 0 drop
  console.log('keeper.setDrop', drop.address)
  await keeper.setDrop(drop.address)

  // Base Price for Egg / Names
  // const exp = ethers.BigNumber.from('10').pow(18)
  // const basePrice = ethers.BigNumber.from('500000').mul(exp)
  const basePrice = ethers.BigNumber.from('30000')

  // // Configure Name price
  console.log('keeper.setNamePrice', basePrice)
  await keeper.setNamePrice(basePrice) // about $20 / name

  // Add eggs
  const eggs = [
    {
      name: 'Base Egg',
      price: basePrice.mul(10), // about $200 / egg
      supply: 16000,
      tokenURI: 'https://db.zoolabs/egg.jpg',
      metadataURI: 'https://db.zoolabs.org/egg.json',
    },
    {
      name: 'Hybrid Egg',
      price: 0,
      supply: 0,
      tokenURI: 'https://db.zoolabs/hybrid.jpg',
      metadataURI: 'https://db.zoolabs.org/hybrid.json',
    },
  ]

  for (const v of eggs) {
    console.log('setEgg', v)
    const tx = await drop.setEgg(v.kind, v.name, v.name, v.price, v.supply, v.tokenURI, v.metadataURI)
    await tx.wait()
  }

  console.log('configureEggs')
  // await drop.configureEggs('Base Egg', 'Hybrid Egg')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
