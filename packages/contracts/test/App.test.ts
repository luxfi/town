import { requireDependencies, setupTestFactory, toNumWei } from './utils'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, Bytes, BytesLike, Wallet, utils } from 'ethers'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'

import { Drop } from '../types/Drop'
import { generatedWallets } from '../utils/generatedWallets'
import { Signer } from '@ethersproject/abstract-signer'
import { App, Market, Media, IMedia, IMarket, IDrop, USDC, App__factory, USDC__factory } from '../types'
import Decimal from '../utils/Decimal'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Blockchain } from '../utils/Blockchain'
import { formatUnits } from '@ethersproject/units'

const { expect } = requireDependencies()

const setupTest = setupTestFactory(['App', 'Media', 'Market', 'USDC'])

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// let provider = new JsonRpcProvider()
// let blockchain = new Blockchain(provider)

type Ask = {
  currency: string
  amount: BigNumberish
}
type Bid = {
  currency: string
  amount: BigNumberish
  bidder: string
  recipient: string
  sellOnShare: { value: BigNumberish }
  offline: boolean
}
// const mintDropTokenType = async (
//   tokenName: string,
//   owner: Signer,
//   {
//     kind,
//     name,
//     ask,
//     supply,
//     tokenURI,
//     metadataURI,
//   }: {
//     kind: number
//     name: string
//     ask: Ask
//     supply: number
//     tokenURI: string
//     metadataURI: string
//   },
// ): Promise<Drop> => {
//   const Drop = await ethers.getContractFactory('Drop', owner)
//   let drop = await Drop.deploy(tokenName)
//   await drop.setTokenType(kind, name, ask, supply, tokenURI, metadataURI)
//   return drop as Drop
// }

describe('App', function () {
  let appAddress: string
  let tokenAddress: string
  let marketAddress: string
  let mediaAddress: string

  let app: App
  let media: Media
  let market: Market
  let drop: Drop
  let currency: USDC

  let tokenId: BigNumberish
  let tokenName: string = 'Bear'
  let nft: any

  let owner: Signer
  let ownerAddress: string
  let nonowner: Signer
  let nonownerAddress: string
  let bidder: Signer
  let bidderAddress: string
  let nonbidder: Signer
  let nonbidderAddress: string

  const appAs = async (owner: Signer) => app.connect(owner)

  const mintCurrency = async (owner: Signer, to: string, value: number) => currency.connect(owner).mint(to, value)
  const approveCurrency = async (owner: Signer, spender: string, amount: BigNumberish = MaxUint256) => currency.connect(owner).approve(spender, amount)
  const setBid = async (app: App, bid: Bid, tokenId: BigNumberish, spender?: string) => {
    await app.setBid(tokenId, bid, { gasLimit: 3500000 })
  }

  let defaultAsk = {
    amount: 100,
    currency: '',
    sellOnShare: Decimal.new(0),
  }

  let defaultDropAttrs = {
    kind: 1,
    ask: defaultAsk,
    name: tokenName,
    supply: 1,
    tokenURI: 'https://db.zoolabs/egg.jpg',
    metadataURI: 'https://db.zoolabs.org/egg.json',
  }

  const prep = async () => {
    const {
      signers,
      tokens: { App, Media, Market, USDC },
    } = await setupTest()

    currency = USDC
    app = App
    appAddress = app.address
    media = Media
    mediaAddress = media.address
    market = Market
    marketAddress = market.address
    tokenAddress = USDC.address

    owner = signers[0]
    ownerAddress = await owner.getAddress()
    nonowner = signers[1]
    nonownerAddress = await nonowner.getAddress()
    bidder = signers[2]
    bidderAddress = await bidder.getAddress()
    nonbidder = signers[3]
    nonbidderAddress = await nonbidder.getAddress()

    const Drop = await ethers.getContractFactory('Drop', owner)
    drop = (await Drop.deploy('Gen1')) as Drop
    defaultDropAttrs.ask.currency = tokenAddress
  }

  const deploy = async () => {
    await prep()
    await app.configure(mediaAddress, marketAddress)
  }

  const addDrop = async (dropName: string, owner: Signer, dropAttr: any = {}) => {
    const attrs = { ...defaultDropAttrs, ...dropAttr }
    const Drop = await ethers.getContractFactory('Drop', owner)
    drop = (await Drop.deploy(dropName)) as Drop
    await drop.setTokenType(attrs.kind, attrs.name, attrs.ask, attrs.supply, attrs.tokenURI, attrs.metadataURI)
    await drop.configure(app.address)
    await app.addDrop(drop.address)
  }

  describe('#constructor', () => {
    it('should be able to deploy', async () => {
      await expect(setupTest()).not.to.be.rejected
    })
  })

  describe('#configuration', () => {
    it('rejects when not configured by the owner', async () => {
      const {
        signers,
        tokens: { App, Media, Market },
      } = await setupTest()
      let one = signers[1]
      await expect(App.connect(one).configure(Media.address, Market.address)).to.be.rejectedWith('Ownable: caller is not the owner')
    })
    it('is configurable by the owner', async () => {
      const {
        signers,
        tokens: { App, Media, Market },
      } = await setupTest()
      await expect(App.connect(signers[0]).configure(Media.address, Market.address)).not.to.be.rejected
    })
  })

  describe('#addDrop', () => {
    beforeEach(async () => await deploy())

    it('rejects if non-owner tries to add a drop', async () => {
      await expect(app.connect(nonowner).addDrop(drop.address)).to.be.rejectedWith('Ownable: caller is not the owner')
    })
    it('allows the owner to add a drop', async () => {
      await expect(app.addDrop(drop.address)).not.to.be.rejected
    })

    it('allows the owner to add a second drop', async () => {
      await expect(app.addDrop(drop.address)).not.to.be.rejected
      const Drop2 = await ethers.getContractFactory('Drop', owner)
      let drop2 = await Drop2.deploy('Gen2')
      await expect(app.addDrop(drop2.address)).not.to.be.reverted
    })
  })

  describe('#minting', async () => {
    beforeEach(async () => await deploy())

    beforeEach(async () => await addDrop('Gen2', owner))

    beforeEach(async () => {
      tokenId = await app.dropAddresses(drop.address)
    })

    it('does not allow a non-owner to mint an NFT', async () => {
      await expect(app.connect(nonowner).mint(tokenId, tokenName)).to.be.rejectedWith('Ownable: caller is not the owner')
    })

    it('allows the owner to mint an NFT', async () => {
      await expect(app.mint(tokenId, tokenName)).not.to.be.rejected
    })

    it('fires a minted event when minting successfully', async () => {
      nft = await app.mint(tokenId, tokenName)
      let { events } = await nft.wait()
      const {
        event,
        args: [id, token],
      } = events[events.length - 1]
      expect(event).to.eql('Mint')
      expect(id).to.equal(1)
      expect(token.name).to.eql(tokenName)
    })

    it('does not allow a token to be minted that does not exist', async () => {
      await expect(app.mint(1234, 'Shark')).to.be.revertedWith('App: Drop does not exist')
    })

    it('increases the total number of mints for a token', async () => {
      await (await app.mint(tokenId, tokenName)).wait()
      expect(await drop.totalMinted(tokenName)).to.equal(1)
    })

    it('only mints an NFT if there is enough supply', async () => {
      await (await app.mint(tokenId, tokenName)).wait()
      expect(await drop.totalMinted(tokenName)).to.equal(1)
      await expect(app.mint(tokenId, tokenName)).to.be.revertedWith('Out of tokens')
    })

    describe('#setName', () => {
      it('does not allow a non-owner to change the name of the NFT', async () => {
        await (await app.mint(tokenId, tokenName)).wait()
        await expect(app.connect(nonowner).setTokenName(tokenId, 'Shark')).to.be.rejectedWith('App: msg sender must be owner of token')
      })
      it('allows the owner of the token to change the name of the NFT', async () => {
        expect(await drop.totalMinted(tokenName)).to.be.equal(0)
        await (await app.mint(tokenId, tokenName)).wait()
        await app.setTokenName(tokenId, 'Shark')
        expect(await app.getTokenName(tokenId)).to.be.eql('Shark')
      })
      it('reverts if a token does not exist and it is trying to change the name', async () => {
        await expect(app.setTokenName(123, 'Shark')).to.be.revertedWith('App: Token does not exist')
      })

      it('cannot get the token name from a token that does not exist', async () => {
        await expect(app.getTokenName(123)).to.be.revertedWith('App: Token does not exist')
      })
    })

    describe('#setBid', () => {
      const defaultBid = {
        amount: 100,
        name: tokenName,
        currency: tokenAddress,
        bidder: bidderAddress,
        recipient: nonbidderAddress,
        sellOnShare: Decimal.new(10),
        offline: false,
      }

      beforeEach(async () => await deploy())
      beforeEach(async () => await addDrop('Gen2', owner))

      beforeEach(async () => {
        defaultBid.currency = tokenAddress
        defaultBid.recipient = nonbidderAddress
        defaultBid.bidder = bidderAddress
        await (await app.mint(tokenId, tokenName)).wait()
      })

      it('rejects if a non-owner tries to set a bid on a token that does not exist', async () => {
        await mintCurrency(owner, defaultBid.bidder, 1000)
        await expect(app.connect(nonowner).setBid(tokenId, defaultBid)).to.be.rejectedWith('Market: Bidder must be msg sender')
      })

      it('reverts if not called from the app contract', async () => {
        await expect(app.connect(nonowner).setBid(tokenId, defaultBid)).rejectedWith('Market: Bidder must be msg sender')
      })

      it('reverts if bidder does not have enough credits', async () => {
        await mintCurrency(owner, defaultBid.bidder, 10)
        await expect(app.connect(bidder).setBid(tokenId, defaultBid)).to.be.rejectedWith('ERC20: transfer amount exceeds allowance')
      })

      it('reverts if bidder does not have enough allowance to give to market', async () => {
        await mintCurrency(owner, bidderAddress, defaultBid.amount)
        await approveCurrency(bidder, appAddress, defaultBid.amount - 10)
        await expect(app.connect(bidder).setBid(tokenId, defaultBid)).to.be.rejectedWith('ERC20: transfer amount exceeds allowance')
      })

      it('reverts if the bid currency is 0 address', async () => {
        await expect(app.connect(bidder).setBid(tokenId, { ...defaultBid, currency: AddressZero })).to.be.rejectedWith('Market: bid currency cannot be 0 address')
      })
      it('reverts if the bid recipient is 0 address', async () => {
        await expect(app.connect(bidder).setBid(tokenId, { ...defaultBid, recipient: AddressZero })).to.be.rejectedWith('Market: bid recipient cannot be 0 address')
      })
      it('reverts if the bidder bids 0 tokens', async () => {
        await expect(app.connect(bidder).setBid(tokenId, { ...defaultBid, amount: 0 })).to.be.rejectedWith('Market: cannot bid amount of 0')
      })

      it('allows the owner to set a bid on a token that exists', async () => {
        await mintCurrency(owner, bidderAddress, defaultBid.amount)
        await approveCurrency(bidder, appAddress, defaultBid.amount)
        await approveCurrency(bidder, marketAddress, defaultBid.amount)

        const beforeBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
        const beforeBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))

        let txn = await app.connect(bidder).setBid(tokenId, defaultBid)
        await txn.wait()
        const bid = await market.connect(bidder).bidForTokenBidder(1, bidderAddress)

        expect(bid.currency).eq(defaultBid.currency)
        const afterBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
        expect(toNumWei(bid.amount)).to.eq(defaultBid.amount)
        expect(bid.bidder).to.eq(defaultBid.bidder)
        expect(beforeBalance).to.eq(afterBalance + defaultBid.amount)

        const afterBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))

        expect(beforeBalanceOfMarket).to.eql(afterBalanceOfMarket - defaultBid.amount)
      })
    })
  })

  //       describe('setBid', () => {

  //         beforeEach(async () => {
  //           defaultBid.bidder = await owner.getAddress()
  //           defaultBid.currency = currency.address

  //           await mintCurrency(currency.address, defaultBid.bidder, 100000000)
  //         })

  //         beforeEach(async () => {
  //           drop = await mintDropTokenType('Bear', owner, { ...defaultDropAttrs, supply: 10 })
  //           let txn = await (await app.mint(tokenId, 'Bear')).wait()
  //           const { events } = txn
  //           const {
  //             args: [id, token],
  //           } = events[events.length - 1]
  //           tokenId = id
  //         })

  //         it.only('can set a bid on a token that exists', async () => {
  //           await currency.approve(await owner.getAddress(), MaxUint256)
  //           await app.setBid(tokenId, defaultBid)
  //         })
  //       })
  //       //
  //     })
  //   })
  // })
})
