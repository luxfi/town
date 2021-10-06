// 13_app.ts

import { Deploy } from '@luxdefi/contracts/utils/deploy'

export default Deploy('App', {
    dependencies: ['Bridge', 'Media', 'LUX', 'BNB', 'Market', 'UniswapV2Factory'],
    proxy: { kind: 'uups' },
  },
  async ({ ethers, deploy, deployments, deps, hre }) => {
    const tx = await deploy()

    const app = await ethers.getContractAt('App', tx.address)
    const factory = await ethers.getContract('UniswapV2Factory')
    const bridge = await ethers.getContract('Bridge')
    const market = await ethers.getContract('Market')
    const media = await ethers.getContract('Media')
    const bnb = await ethers.getContract('BNB')
    const lux = await ethers.getContract('LUX')

    // Get pair address from Factory
    // const pair = await factory.getPair(lux.address, bnb.address)
    // console.log(pair)

    // Configure contracts to talk to each other
    await market.configure(media.address)
    await media.configure(market.address)
    await app.configure(media.address, lux.address, lux.address, bridge.address, true)

    if (hre.network.name == 'mainnet') return

    // Mint lux to app for yield
    await lux.mint(app.address, 1000000000000)
  },
)
