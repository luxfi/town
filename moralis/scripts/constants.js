require('dotenv').config()

const APPLICATION_ID = process.env.APPLICATION_ID
const MASTER_KEY = process.env.MASTER_KEY
const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'hardhat'

const CHAIN_ID = {
    mainnet: '0x1', // ethereum
    testnet: '0x4', // rinkeby
    hardhat: '0x539', // localhost 1337
}[NETWORK]

const SUBDOMAIN = {
    mainnet: 'dblpeaqbqk32.usemoralis.com',
    testnet: 'j0ixlvmwc1kz.usemoralis.com',
    hardhat: 'udnjb2wy2cep.grandmoralis.com', // udnjb2wy2cep.grandmoralis.com
}[NETWORK]

const DEPLOYMENT = {
    mainnet: 'mainnet',
    testnet: 'testnet',
    hardhat: 'localhost',
}[NETWORK]

module.exports = {
    APPLICATION_ID,
    MASTER_KEY,
    NETWORK,
    CHAIN_ID,
    SUBDOMAIN,
    DEPLOYMENT,
}