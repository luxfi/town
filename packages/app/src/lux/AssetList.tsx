import React, { useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
import { NFT_VALIDATOR, NFT_ATM, NFT_WALLET, NFT_CASH } from '../functions/assetLists'
import { useContract } from '../hooks'
import Asset from './Asset'
import _ from 'lodash'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { newNft } from '../functions/assets'

export type AssetListProps = {
  className?: string
  tokenType: string
  tokenName: string
  autoPlay?: boolean
  getTriggerProps?: GetTriggerProps
} & React.HTMLAttributes<HTMLDivElement>
const perPage = 6

const getAssets = (type: string, firstTokenId: number, totalMinted: number, page: number) => {
  const start = page * perPage - perPage
  const end = page * perPage
  // const finalEnd = end >=  ? end : totalMinted

  return _.range(start, end).map((tokenId) => newNft(tokenId, type))
}

const AssetList = (props: AssetListProps) => {
  const [assets, setAssets] = useState([])
  const [firstTokenId, setFirstTokenId] = useState(null)
  const [totalMinted, setTotalMinted] = useState(null)
  const [page, setPage] = useState(1)

  const drop = useContract('Drop')

  useEffect(() => {
    drop.firstTokenId(props.tokenName).then((bn) => setFirstTokenId(bn.toNumber()))
    drop.totalMinted(props.tokenName).then((bn) => setTotalMinted(bn.toNumber()))
  }, [props.tokenName])

  useEffect(() => {
    if (typeof firstTokenId === 'number' && typeof totalMinted === 'number') {
      setAssets(getAssets(props.tokenName, firstTokenId, totalMinted, page))
    }
  }, [firstTokenId, totalMinted, page])

  console.log('AssetList', { firstTokenId, totalMinted })

  return (
    <div className={`AssetList`}>
      <div className="mb-10">
        <div className="text-xl text-center text-gray-600">{props.tokenName} NFTs</div>
        <div className="text-center">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            <div className="cursor-pointer">
              <HiOutlineChevronLeft />
            </div>
            <div>{props.tokenName}s 0-6</div>
            <div className="cursor-pointer">
              <HiOutlineChevronRight />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {assets.map((asset) => (
            <Asset key={asset.tokenId} {...asset} showPrice={false} autoPlay getTriggerProps={props.getTriggerProps} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssetList
