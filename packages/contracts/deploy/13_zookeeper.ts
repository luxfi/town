// 13_zookeeper.ts

import { Deploy } from 'luxdefi/contracts/utils/deploy'

export default Deploy('ZooKeeper', {
    dependencies: ['Bridge', 'Media', 'ZOO', 'BNB', 'Market', 'UniswapV2Factory', 'UniswapV2Pair'],
    // proxy: { kind: 'uups' },
  },
  async ({ ethers, deploy, deployments, deps, hre }) => {
    const tx = await deploy()

    const keeper = await ethers.getContractAt('ZooKeeper', tx.address)
    const factory = await ethers.getContract('UniswapV2Factory')
    const bridge = await ethers.getContract('Bridge')
    const market = await ethers.getContract('Market')
    const media = await ethers.getContract('Media')
    const bnb = await ethers.getContract('BNB')
    const zoo = await ethers.getContract('ZOO')

    // Get pair address from Factory
    const pair = await factory.getPair(zoo.address, bnb.address)
    console.log(pair)

    // Configure contracts to talk to each other
    await market.configure(media.address)
    await media.configure(market.address)
    await keeper.configure(media.address, zoo.address, pair, bridge.address, true)

    if (hre.network.name == 'mainnet') return

    // Mint ZOO to keeper for yield
    await zoo.mint(keeper.address, 1000000000000)
  },
)
