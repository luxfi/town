import { ChainId } from '@luxdefi/sdk'
import localhostUploads from '../uploaded/localhost.json'

export default {
  [ChainId.MAINNET]: localhostUploads,
  [ChainId.RINKEBY]: localhostUploads,
  [ChainId.HARDHAT]: localhostUploads,
}
