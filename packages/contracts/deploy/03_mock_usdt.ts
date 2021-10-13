// 02_weth.ts

import { Deploy } from '@luxdefi/contracts/utils/deploy'

export default Deploy('USDT', {}, async ({ hre, deploy, deployments, deps }) => {
  if (hre.network.name == 'mainnet') return

  await deploy([hre.ethers.utils.parseUnits('1000000', 6)])
})
