import { requireDependencies, setupTestFactory } from './utils'
import { ethers } from 'hardhat'
import { Drop } from '../types/Drop'
import { Signer } from '@ethersproject/abstract-signer'
import { App, IMedia, IMarket, IDrop } from '../types'

const { expect } = requireDependencies()

const setupTest = setupTestFactory(['App', 'Media', 'Market'])

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe('App', function () {
  it('can be configured with a media and a market by the owner', async () => {
    const {
      tokens: { App, Media, Market },
    } = await setupTest()

    await expect(App.configure(Media.address, Market.address)).not.to.be.reverted
    expect(await App.media()).to.eql(Media.address)
    expect(await App.market()).to.eql(Market.address)
  })

  it('cannot be configured by a non-owner', async () => {
    const {
      signers,
      tokens: { App, Media, Market },
    } = await setupTest()
    const one = signers[1]
    let app = App.connect(one)
    await expect(app.configure(Media.address, Market.address)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  describe('deployed', function () {
    let app: App
    let media: IMedia
    let market: IMarket
    let drop: any
    let owner: Signer
    let nonowner: Signer

    beforeEach(async () => {
      const {
        signers,
        tokens: { App, Media, Market },
      } = await setupTest()
      app = App
      media = Media
      market = Market

      owner = signers[0]
      nonowner = signers[1]
      await App.configure(Media.address, Market.address)

      const Drop = await ethers.getContractFactory('Drop', owner)
      drop = await Drop.deploy('Gen1')
    })

    it('allows the owner to add a drop', async () => {
      await expect(app.addDrop(drop.address)).not.to.be.reverted
    })

    it('does not allow a non-owner to add a drop', async () => {
      app = app.connect(nonowner)
      await expect(app.addDrop(drop.address)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    describe('with a drop', () => {
      beforeEach(async () => {
        await drop.configure(app.address)
        await app.addDrop(drop.address)
      })
      it('can fetch the drop added', async () => {
        expect(await app.drops(1)).to.eql(drop.address)
      })
      it('can fetch the drop id by the drop address', async () => {
        await expect(await app.dropAddresses(drop.address)).to.equal(1)
      })
      it('can make a second drop', async () => {
        const Drop2 = await ethers.getContractFactory('Drop', owner)
        let drop2 = await Drop2.deploy('Gen2')
        await expect(app.addDrop(drop2.address)).not.to.be.reverted
      })

      describe('minting', async () => {
        it('the app can mint an NFT by id', async () => {
          let nft = await app.mint(1, 'Gen1')
          console.log(nft)
        })
      })
    })
  })
})
