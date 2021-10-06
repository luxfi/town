// 10_bridge.ts

import { Deploy } from 'luxdefi/contracts/utils/deploy'

export default Deploy('Bridge', {dependencies: ['ZOO', 'DAO']}, async({ ethers, getChainId, deploy, deps }) => {
  const { DAO } = deps
  const tx = await deploy([DAO.address, 25])
  const ZOO = await ethers.getContract('ZOO')
  await ZOO.configure(tx.address)
})
