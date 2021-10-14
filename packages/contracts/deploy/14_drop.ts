// 14_drop.ts
import { Deploy } from '@luxdefi/contracts/utils/deploy'
import mint from '../utils/mint'

export default Deploy('Drop', {}, async ({ hre, ethers, deploy }) => {
  const tx = await deploy(['Gen 0'])

  if (hre.network.name == 'mainnet') return

  const drop = await ethers.getContractAt('Drop', tx.address)
  const app = await ethers.getContract('App')
  const media = await ethers.getContract('Media')

  console.log('Configure Add Drop to App', drop.address)
  await app.addDrop(drop.address)

  console.log('Configure Drop with App', app.address)
  await drop.configure(app.address)

  console.log('Configure media.setApprovalForAll', app.address)
  await media.setApprovalForAll(app.address, true)

  // await mint(app, drop, hre.network.name)
})
