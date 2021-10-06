// 10_bridge.ts

import { Deploy } from '@luxdefi/contracts/utils/deploy'

export default Deploy('Bridge', {dependencies: ['LUX', 'DAO']}, async({ ethers, getChainId, deploy, deps }) => {
  const { DAO } = deps
  const tx = await deploy([DAO.address, 25])
  const LUX = await ethers.getContract('LUX')
  await LUX.configure(tx.address)
})
