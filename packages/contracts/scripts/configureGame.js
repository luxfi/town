const hre = require('hardhat')
const ethers = hre.ethers

const NETWORK = process.env.HARDHAT_NETWORK ? process.env.HARDHAT_NETWORK : 'hardhat'

console.log(`Configure game on ${NETWORK}`)

const DEPLOYMENT = {
  localhost: 'localhost',
  hardhat: 'localhost',
  testnet: 'testnet',
  mainnet: 'mainnet',
}[NETWORK]

const App = require(`../deployments/${DEPLOYMENT}/App.json`)
// const bridge = require(`../deployments/${DEPLOYMENT}/Bridge.json`)

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

  // console.log(await ethers.getNamedSigners())

  const app = await (await ethers.getContractAt('App', App.address)).connect(signer)

  await app.mintMany(1, 'Validator', 10)
  await app.mintMany(1, 'ATM', 10)
  await app.mintMany(1, 'Wallet', 10)

  console.log('Minted')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
