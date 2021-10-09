require('dotenv').config()

const APPLICATION_ID = process.env.APPLICATION_ID
const MASTER_KEY = process.env.MASTER_KEY
const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'hardhat'

const CHAIN_ID = {
    ethereum: '0x1',
    rinkeby: '0x4',
    hardhat: '0x539',
}[NETWORK]

const SUBDOMAIN = {
    ethereum: 'dblpeaqbqk32.usemoralis.com',
    rinkeby: 'j0ixlvmwc1kz.usemoralis.com',
    hardhat: 'fyl685diuhwz.moralishost.com',
}[NETWORK]

const DEPLOYMENT = {
    ethereum: 'ethereum',
    rinkeby: 'rinkeby',
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