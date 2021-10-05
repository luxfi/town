const fs = require('fs')
const spawn = require('child_process').spawn
require('dotenv').config()

const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'hardhat'

const chainID = {
  hardhat:  '0x539',
  testnet:  '0x61',
  mainnet:  '0x38',
  ethereum: '0x1',
  ropsten:  '0x3',
  rinkeby:  '0x4',
}[NETWORK]

const subdomain = {
  hardhat:  'crkoxpwp0jgk.moralishost.com',
  // testnet:  'bv47r2tczd0v.moralishost.com',
  testnet:  'dblpeaqbqk32.usemoralis.com',
  mainnet:  'j0ixlvmwc1kz.usemoralis.com',
  ethereum: 'csiwdg4boaa8.usemoralis.com',
  ropsten:  '8sebtwlhn2ic.moralisweb3.com',
}[NETWORK]

const DEPLOYMENT = {
  hardhat:  'localhost',
  testnet:  'testnet',
  mainnet:  'mainnet',
  ethereum: 'ethereum',
  rinkeby:  'rinkeby',
  ropsten:  'ropsten',
}[NETWORK]

const cached = __dirname + '/../../../node_modules/moralis-cached.js'
const funcJS = fs.readFileSync(__dirname + '/../src/functions.js')
const zkJSON = fs.readFileSync(__dirname + `/../../contracts/deployments/${DEPLOYMENT}/ZooKeeper.json`)
const cloudFunctions = String(funcJS).replace('0x38', chainID).replace('ZK={}', 'ZK=' + zkJSON)

fs.writeFileSync(cached, cloudFunctions)

const child = spawn('node', ['node_modules/.bin/moralis-admin-cli', 'watch-cloud-file', '--moralisSubdomain', subdomain, '--moralisCloudFile', cached], { shell: true })

child.stdout.on('data', (data) => {
  if (String(data).match(/File Uploaded Correctly/)) {
    console.log(`Updated Cloud Functions for ${NETWORK}`)

    child.kill('SIGHUP')
    process.exit(0)
  }

  // anything else should be logged
  console.error(String(data))
  if (String(data).match(/File Uploaded Failed/)) {
    child.kill('SIGHUP')
    process.exit(1)
  }
})
