import { requireDependencies, setupTestFactory, toNumWei } from './utils'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, Bytes, BytesLike, Wallet, utils } from 'ethers'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'

import { Drop } from '../types/Drop'
import { generatedWallets } from '../utils/generatedWallets'
import { Signer } from '@ethersproject/abstract-signer'
import { App, Market, Media, IMedia, IMarket, IDrop, USDC, WETH, App__factory, USDC__factory } from '../types'
import Decimal from '../utils/Decimal'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Blockchain } from '../utils/Blockchain'
import { formatUnits } from '@ethersproject/units'

const { expect } = requireDependencies()

const setupTest = setupTestFactory(['App', 'Media', 'Market', 'USDC', 'WETH'])

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
  let otherCurrency: WETH

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
  let creator: Signer
  let creatorAddress: string
  let nftOwner: Signer
  let nftOwnerAddress: string

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
      tokens: { App, Media, Market, USDC, WETH },
    } = await setupTest()

    currency = USDC
    otherCurrency = WETH
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
    creator = signers[4]
    creatorAddress = await creator.getAddress()

    nftOwner = signers[5]
    nftOwnerAddress = await nftOwner.getAddress()

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
      tokenId = await app.dropAddresses(drop.address)
    })

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

    it('reverts if trying to bid on a non-existing token', async () => {
      await mintCurrency(owner, bidderAddress, defaultBid.amount)
      await approveCurrency(bidder, marketAddress, defaultBid.amount)

      await expect(app.connect(bidder).setBid(1234, defaultBid)).to.be.rejectedWith('App: Token does not exist')
    })

    it('allows the owner to set a bid on a token that exists', async () => {
      await mintCurrency(owner, bidderAddress, defaultBid.amount)
      await approveCurrency(bidder, marketAddress, defaultBid.amount)

      const beforeBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
      const beforeBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))

      let txn = await app.connect(bidder).setBid(tokenId, defaultBid)
      await txn.wait()
      const bid = await market.connect(bidder).bidForTokenBidder(1, bidderAddress)

      expect(bid.currency).eq(defaultBid.currency)
      const afterBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
      const afterBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))
      expect(toNumWei(bid.amount)).to.eq(defaultBid.amount)
      expect(bid.bidder).to.eq(defaultBid.bidder)
      expect(beforeBalance).to.eq(afterBalance + defaultBid.amount)
      expect(beforeBalanceOfMarket).to.eql(afterBalanceOfMarket - defaultBid.amount)
    })
  })

  describe('#setLazyBid', () => {
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
    beforeEach(async () => await addDrop('Gen3', owner))
    beforeEach(async () => {
      tokenId = await app.dropAddresses(drop.address)
    })

    beforeEach(async () => {
      defaultBid.currency = tokenAddress
      defaultBid.recipient = nonbidderAddress
      defaultBid.bidder = bidderAddress
      await (await app.mint(tokenId, tokenName)).wait()
    })

    it('reverts if drop does not exist', async () => {
      await expect(app.connect(bidder).setLazyBid(1234, tokenName, defaultBid)).to.be.rejectedWith('App: Drop does not exist')
    })

    it('reverts if drop has no supply left', async () => {
      await addDrop('WeirdDrop', owner, { supply: 0 })
      let tokenId = await app.dropAddresses(drop.address)
      await expect(app.connect(bidder).setLazyBid(tokenId, tokenName, defaultBid)).to.be.rejectedWith('App: token type does not exist')
    })

    it('reverts if the currency is not payable', async () => {
      await expect(app.connect(bidder).setLazyBid(tokenId, tokenName, { ...defaultBid, currency: AddressZero })).to.be.rejectedWith('App: currency must be payable')
    })

    it('reverts if not sent by the owner', async () => {
      await expect(app.connect(nonbidder).setLazyBid(tokenId, tokenName, defaultBid)).to.be.rejectedWith('Market: Bidder must be msg sender')
    })

    it('reverts if sending to a 0 address', async () => {
      await expect(app.connect(bidder).setLazyBid(tokenId, tokenName, { ...defaultBid, recipient: AddressZero })).to.be.rejectedWith('Market: bid recipient cannot be 0 address')
    })

    it('reverts if sending 0 amount', async () => {
      await expect(app.connect(bidder).setLazyBid(tokenId, tokenName, { ...defaultBid, amount: 0 })).to.be.rejectedWith('Market: cannot bid amount of 0')
    })

    it('can receive a valid lazyBid', async () => {
      await mintCurrency(owner, bidderAddress, defaultBid.amount)
      await approveCurrency(bidder, marketAddress, defaultBid.amount)

      const beforeBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
      const beforeBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))

      let txn = await app.connect(bidder).setLazyBid(tokenId, tokenName, defaultBid)
      await txn.wait()

      const afterBalance = toNumWei(await currency.balanceOf(defaultBid.bidder))
      const afterBalanceOfMarket = toNumWei(await currency.balanceOf(marketAddress))

      expect(beforeBalance).to.eql(afterBalance + defaultBid.amount)
      expect(beforeBalanceOfMarket).to.eql(afterBalanceOfMarket - defaultBid.amount)
    })
  })

  describe('#acceptBid', () => {
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
    beforeEach(async () => await addDrop('Gen3', creator))
    beforeEach(async () => {
      tokenId = await app.dropAddresses(drop.address)
    })

    beforeEach(async () => {
      defaultBid.currency = tokenAddress
      defaultBid.recipient = nonbidderAddress
      defaultBid.bidder = bidderAddress
      await (await app.mint(tokenId, tokenName)).wait()
    })

    beforeEach(async () => {
      await mintCurrency(owner, bidderAddress, defaultBid.amount)
      await approveCurrency(bidder, marketAddress, defaultBid.amount)
      await app.connect(bidder).setBid(tokenId, defaultBid)
    })

    it('reverts if the token does not exist', async () => {
      await expect(app.connect(bidder).acceptBid(1234, defaultBid)).to.be.rejectedWith('App: Token does not exist')
    })

    it('reverts if not called by the app contract', async () => {
      await expect(app.connect(nonbidder).acceptBid(tokenId, defaultBid)).rejectedWith('Media: Only approved or owner')
    })

    it('reverts if bid amount differs from expected amount', async () => {
      // await app.connect(bidder).setBid(tokenId, { ...defaultBid, amount: 0 })
      // let bid = await market.bidForTokenBidder(tokenId, bidderAddress)
      await expect(app.acceptBid(tokenId, { ...defaultBid, amount: 90 })).rejectedWith('Market: Unexpected bid found.')
    })

    it('reverts if bid amount differs from expected currency', async () => {
      await expect(app.acceptBid(tokenId, { ...defaultBid, currency: otherCurrency.address })).rejectedWith('Market: Unexpected bid found.')
    })

    it('reverts if the bid receipients are different', async () => {
      await expect(app.acceptBid(tokenId, { ...defaultBid, recipient: nonownerAddress })).rejectedWith('Market: Unexpected bid found.')
    })

    describe('accepts a valid bid', () => {
      it('and sends funds to the owner of the nft', async () => {
        const beforeOwnerBalance = toNumWei(await currency.balanceOf(ownerAddress))

        let txn = await app.acceptBid(tokenId, defaultBid)
        await txn.wait()

        const afterOwnerBalance = toNumWei(await currency.balanceOf(ownerAddress))
        expect(beforeOwnerBalance).to.eql(afterOwnerBalance - defaultBid.amount)
      })

      it('and sends the receipient of the nft', async () => {
        const beforeOwner = await media.ownerOf(tokenId)

        let txn = await app.acceptBid(tokenId, defaultBid)
        await txn.wait()

        const afterOwner = await media.ownerOf(tokenId)
        expect(beforeOwner).not.to.be.eql(afterOwner)
        expect(afterOwner).to.be.eql(defaultBid.recipient)
      })

      it('and removes the bid from the app', async () => {
        const beforeBid = await market.bidForTokenBidder(tokenId, bidderAddress)
        expect(beforeBid.recipient).not.to.eql(AddressZero)
        expect(beforeBid.recipient).to.eql(defaultBid.recipient)

        let txn = await app.acceptBid(tokenId, defaultBid)
        await txn.wait()

        const afterBid = await market.bidForTokenBidder(tokenId, bidderAddress)
        expect(afterBid.recipient).to.eql(AddressZero)
      })
    })
  })

  describe('#withdraw', () => {
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
    beforeEach(async () => await addDrop('Gen3', creator))
    beforeEach(async () => {
      tokenId = await app.dropAddresses(drop.address)
    })

    beforeEach(async () => {
      defaultBid.currency = tokenAddress
      defaultBid.recipient = nonbidderAddress
      defaultBid.bidder = bidderAddress
      await (await app.mint(tokenId, tokenName)).wait()
    })

    beforeEach(async () => {
      await mintCurrency(owner, bidderAddress, defaultBid.amount)
      await approveCurrency(bidder, marketAddress, defaultBid.amount)
      await app.connect(bidder).setBid(tokenId, defaultBid)
    })

    it('reverts if the token does not exist', async () => {
      await expect(app.connect(bidder).acceptBid(1234, defaultBid)).to.be.rejectedWith('App: Token does not exist')
    })
  })
})
