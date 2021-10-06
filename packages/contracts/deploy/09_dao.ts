// 09_dao.ts

import { Deploy } from 'luxdefi/contracts/utils/deploy'

export default Deploy('DAO', {
    proxy: { kind: 'uups' }
  },
  async({ ethers, getChainId, deploy, deps, signers }) => {
    await deploy()
  }
)
