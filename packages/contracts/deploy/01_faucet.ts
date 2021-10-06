// 01_faucet.ts

import { Deploy } from '@luxdefi/contracts/utils/deploy'

export default Deploy('Faucet', { dependencies: ['LUX'] }, async({ ethers, deploy, deployments, deps, hre }) => {
  const token = await ethers.getContract('LUX')

  const tx = await deploy([token.address])

  if (hre.network.name == 'mainnet') return

  // 100B LUX to faucet
  const exp = ethers.BigNumber.from('10').pow(18)
  const amount = ethers.BigNumber.from('1000000000000').mul(exp)
  await token.mint(tx.address, amount)

  // Get signers to fund
  const signers = await ethers.getSigners()

  // 100M LUX to each signer
  const signerAmount = ethers.BigNumber.from('1000000000').mul(exp)

  // Mint new tokens
  for (var i = 0; i < signers.length; i++) {
    await token.mint(signers[i].address, signerAmount)
  }
})
