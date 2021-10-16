import React, { useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
// import { NFT_VALIDATOR, NFT_ATM, NFT_WALLET, NFT_CASH } from '../functions/assetLists'
import { useContract } from '../hooks'
import Asset from './Asset'
import _ from 'lodash'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { newNft } from '../functions/assets'

type PaginatedAssets = {
  type: string
  page: number
  start: number
  end: number
  endTokenId: number
  totalPages: number
  assets: object[]
}

export type AssetListProps = {
  className?: string
  tokenType: string
  tokenName: string
  autoPlay?: boolean
  animate?: boolean
  large?: boolean
  getTriggerProps?: GetTriggerProps
  onLoadAssets: (assets: object[]) => void
} & React.HTMLAttributes<HTMLDivElement>

const getPages = (total: number, perPage: number) => {
  var chunks: number[] = Array(Math.floor(total / perPage)).fill(perPage)
  var remainder = total % perPage
  if (remainder > 0) {
    chunks.push(remainder)
  }
  return chunks
}

const getPaginatedAssets = (
  type: string,
  firstTokenId: number,
  totalMinted: number,
  page: number,
  perPage: number = 6
): PaginatedAssets => {
  const pages = getPages(totalMinted, perPage)
  const totalPages = pages.length
  const pageQuantity = pages[page - 1]
  const start = page * perPage - perPage + firstTokenId
  const end = start + pageQuantity
  const endTokenId = end - 1
  return {
    type,
    page,
    start,
    end,
    endTokenId,
    totalPages,
    assets: _.range(start, end).map((tokenId) => newNft(tokenId, type)),
  }
}

const AssetList = (props: AssetListProps) => {
  const [paginatedAssets, setPaginatedAssets] = useState({
    start: 0,
    end: 6,
    assets: [],
    totalPages: 1,
    endTokenId: 5,
  })
  const { assets, start, end, endTokenId } = paginatedAssets
  const [firstTokenId, setFirstTokenId] = useState(null)
  const [totalMinted, setTotalMinted] = useState(null)
  const [page, setPage] = useState(1)

  const drop = useContract('Drop')

  useEffect(() => {
    if (drop) {
      drop.firstTokenId(props.tokenName).then((bn) => setFirstTokenId(bn.toNumber()))
      drop.totalMinted(props.tokenName).then((bn) => setTotalMinted(bn.toNumber()))
    }
  }, [props.tokenName])

  useEffect(() => {
    if (firstTokenId >= 0 && totalMinted) {
      const paginatedAssets = getPaginatedAssets(props.tokenName, firstTokenId, totalMinted, page)
      setPaginatedAssets(paginatedAssets)
      props.onLoadAssets(paginatedAssets.assets)
    }
  }, [props.tokenName, firstTokenId, totalMinted, page])

  const previousPage = (page) => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const nextPage = (page, paginatedAssets) => {
    if (page < paginatedAssets.totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <div className={`AssetList`}>
      <div className="mb-10">
        <div className="text-center">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            <div className="cursor-pointer" onClick={() => previousPage(page)}>
              <HiOutlineChevronLeft />
            </div>
            <div>
              {props.tokenType}s {start} to {endTokenId}
            </div>
            <div className="cursor-pointer" onClick={() => nextPage(page, paginatedAssets)}>
              <HiOutlineChevronRight />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {assets.map((asset) => (
            <Asset
              key={asset.tokenId}
              {...asset}
              showPrice={false}
              animate={props.animate}
              large={props.large}
              getTriggerProps={props.getTriggerProps}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssetList
