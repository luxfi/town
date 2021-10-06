// 16_farm.ts

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

// Change to use Deploy helper
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts } = hre
  const { deploy } = deployments

  const [deployer] = await ethers.getSigners()

  const tokenAddress = (await deployments.get('ZOO')).address
  const daoAddress = (await deployments.get('DAO')).address

  await deploy('Farm', {
    from: deployer.address,
    args: [daoAddress, 10, tokenAddress, 100, 0, 20],
    log: true,
  })
}

export default func
func.id = 'farm'
func.tags = ['Farm']
func.dependencies = []
