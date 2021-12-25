const fs = require('fs')
const spawn = require('child_process').spawn
require('dotenv').config()

const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'hardhat'

const chainID = {
  hardhat: '0x539',
  testnet: '0x4',
  mainnet: '0x1',
}[NETWORK]

const subdomain = {
  hardhat: 'udnjb2wy2cep.grandmoralis.com',
  testnet: 'dblpeaqbqk32.usemoralis.com',
  mainnet: 'j0ixlvmwc1kz.usemoralis.com',
}[NETWORK]

const DEPLOYMENT = {
  hardhat: 'localhost',
  testnet: 'testnet',
  mainnet: 'mainnet',
}[NETWORK]

const cached = __dirname + '/../../../node_modules/moralis-cached.js'
const funcJS = fs.readFileSync(__dirname + '/../src/functions.js')
const appJSON = fs.readFileSync(__dirname + `/../../contracts/deployments/${DEPLOYMENT}/App.json`)
const cloudFunctions = String(funcJS).replace('0x38', chainID).replace('App={}', 'App=' + appJSON)

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
