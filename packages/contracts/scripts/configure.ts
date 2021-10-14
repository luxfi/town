import { ethers } from 'hardhat'
import mint from '../utils/mint'

const NETWORK = process.env.HARDHAT_NETWORK ? process.env.HARDHAT_NETWORK : 'hardhat'

console.log(`Configure game on ${NETWORK}`)

const DEPLOYMENT = {
  localhost: 'localhost',
  hardhat: 'localhost',
  testnet: 'testnet',
  mainnet: 'mainnet',
}[NETWORK]

const App = require(`../deployments/${DEPLOYMENT}/App.json`)
const Drop = require(`../deployments/${DEPLOYMENT}/Drop.json`)

async function main() {
  const [signer] = await ethers.getSigners()

  const app = await (await ethers.getContractAt('App', App.address)).connect(signer)
  const drop = await (await ethers.getContractAt('Drop', Drop.address)).connect(signer)

  await mint(app, drop, NETWORK)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
