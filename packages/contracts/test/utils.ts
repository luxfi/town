// @ts-ignore
import { ethers, deployments } from 'hardhat'
import { App } from '../types'
import { sha256 } from 'ethers/lib/utils'
import Decimal from '../utils/Decimal'
import { BigNumber, BigNumberish, Contract, providers, Signer } from 'ethers'
import { MaxUint256, AddressZero } from '@ethersproject/constants'
import { generatedWallets } from '../utils/generatedWallets'
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatUnits } from '@ethersproject/units'
import { Wallet } from '@ethersproject/wallet'
import { recoverTypedMessage, recoverTypedSignature, signTypedData } from 'eth-sig-util'
import { bufferToHex, ecrecover, fromRpcSig, pubToAddress } from 'ethereumjs-util'
import { toUtf8Bytes, formatBytes32String } from 'ethers/lib/utils'
import { getContractAddress } from '@ethersproject/address'

export const requireDependencies = () => {
  const chai = require('chai')
  const expect = chai.expect
  const asPromised = require('chai-as-promised')
  const { solidity } = require('ethereum-waffle')

  chai.use(asPromised)
  chai.use(solidity)

  return {
    chai,
    expect,
    asPromised,
    solidity,
  }
}

const deployContractsAsync = async (contractArr: string[], owner: Signer) => {
  return await contractArr.reduce(async (prev: Promise<{}>, name: string) => {
    const sum = await prev
    const contract: any = await ethers.getContract(name, owner)
    sum[name] = contract
    return sum
  }, Promise.resolve({}))
}

export const setupTestFactory = (contractArr: string[]) =>
  deployments.createFixture(async ({ deployments, getNamedAccounts, ethers }, options) => {
    requireDependencies()
    await deployments.fixture(contractArr, { fallbackToGlobal: true })

    const signers = await ethers.getSigners()
    const owner = (await getNamedAccounts()).deployer

    let tokens: { [key: string]: any } = await deployContractsAsync(contractArr, signers[0])
    // contractArr.reduce(async (sum: {}, name: string) => {
    //   const contract: Contract = await ethers.getContract(name)
    //   return {
    //     [name]: contract,
    //     ...sum,
    //   }
    // }, {})

    return {
      deployments: deployments,
      owner: owner,
      signers: signers,
      tokens,
      // wallets,
    }
  })

const getContractByNonce = async (name: string, ownerAddress: string, nonce: number) => {
  const futureAddress = await getContractAddress({
    from: ownerAddress,
    nonce,
  })
  return await ethers.getContractAt(name, futureAddress)
}

export function toNumWei(val: BigNumber) {
  return parseFloat(formatUnits(val, 'wei'))
}

export type EIP712Sig = {
  deadline: BigNumberish
  v: any
  r: any
  s: any
}

// export async function signPermit(owner: Wallet, toAddress: string, tokenAddress: string, tokenId: number, chainId: number) {
//   return new Promise<EIP712Sig>(async (res, reject) => {
//     let nonce
//     const mediaContract = Media__factory.connect(tokenAddress, owner)

//     try {
//       nonce = (await mediaContract.permitNonces(owner.address, tokenId)).toNumber()
//     } catch (e) {
//       console.error('NONCE', e)
//       reject(e)
//       return
//     }

//     const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 // 24 hours
//     const name = await mediaContract.name()

//     try {
//       const sig = signTypedData(Buffer.from(owner.privateKey.slice(2), 'hex'), {
//         data: {
//           types: {
//             EIP712Domain: [
//               { name: 'name', type: 'string' },
//               { name: 'version', type: 'string' },
//               { name: 'chainId', type: 'uint256' },
//               { name: 'verifyingContract', type: 'address' },
//             ],
//             Permit: [
//               { name: 'spender', type: 'address' },
//               { name: 'tokenId', type: 'uint256' },
//               { name: 'nonce', type: 'uint256' },
//               { name: 'deadline', type: 'uint256' },
//             ],
//           },
//           primaryType: 'Permit',
//           domain: {
//             name,
//             version: '1',
//             chainId,
//             verifyingContract: mediaContract.address,
//           },
//           message: {
//             spender: toAddress,
//             tokenId,
//             nonce,
//             deadline,
//           },
//         },
//       })
//       const response = fromRpcSig(sig)
//       res({
//         r: response.r,
//         s: response.s,
//         v: response.v,
//         deadline: deadline.toString(),
//       })
//     } catch (e) {
//       console.error(e)
//       reject(e)
//     }
//   })
// }

// export async function signMintWithSig(
//   owner: Wallet,
//   tokenAddress: string,
//   creator: string,
//   contentHash: string,
//   metadataHash: string,
//   creatorShare: BigNumberish,
//   chainId: number,
// ) {
//   return new Promise<EIP712Sig>(async (res, reject) => {
//     let nonce
//     const mediaContract = Media__factory.connect(tokenAddress, owner)

//     try {
//       nonce = (await mediaContract.mintWithSigNonces(creator)).toNumber()
//     } catch (e) {
//       console.error('NONCE', e)
//       reject(e)
//       return
//     }

//     const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 // 24 hours
//     const name = await mediaContract.name()

//     try {
//       const sig = signTypedData(Buffer.from(owner.privateKey.slice(2), 'hex'), {
//         data: {
//           types: {
//             EIP712Domain: [
//               { name: 'name', type: 'string' },
//               { name: 'version', type: 'string' },
//               { name: 'chainId', type: 'uint256' },
//               { name: 'verifyingContract', type: 'address' },
//             ],
//             MintWithSig: [
//               { name: 'contentHash', type: 'bytes32' },
//               { name: 'metadataHash', type: 'bytes32' },
//               { name: 'creatorShare', type: 'uint256' },
//               { name: 'nonce', type: 'uint256' },
//               { name: 'deadline', type: 'uint256' },
//             ],
//           },
//           primaryType: 'MintWithSig',
//           domain: {
//             name,
//             version: '1',
//             chainId,
//             verifyingContract: mediaContract.address,
//           },
//           message: {
//             contentHash,
//             metadataHash,
//             creatorShare,
//             nonce,
//             deadline,
//           },
//         },
//       })
//       const response = fromRpcSig(sig)
//       res({
//         r: response.r,
//         s: response.s,
//         v: response.v,
//         deadline: deadline.toString(),
//       })
//     } catch (e) {
//       console.error(e)
//       reject(e)
//     }
//   })
// }

// export const THOUSANDTH_ZOO = ethers.utils.parseUnits('0.001', 'ether') as BigNumber
// export const TENTH_ZOO = ethers.utils.parseUnits('0.1', 'ether') as BigNumber
// export const ONE_ZOO = ethers.utils.parseUnits('1', 'ether') as BigNumber
// export const TWO_ZOO = ethers.utils.parseUnits('2', 'ether') as BigNumber
