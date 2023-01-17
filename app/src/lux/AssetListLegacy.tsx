import React, { useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
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
  const { assets, start, endTokenId } = paginatedAssets
  const [firstTokenId, setFirstTokenId] = useState(null)
  const [totalMinted, setTotalMinted] = useState(null)
  const [page, setPage] = useState(1)

  const drop = useContract('Drop')

  useEffect(() => {
    if (drop) {
      // drop.firstTokenId(props.tokenName).then((bn) => setFirstTokenId(bn.toNumber()))
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
    <div className={`AssetList pb-10 mb-10 border-b-gray-900 border-b-2`}>
      <div className="">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-2xl text-indigo-600">{props.tokenType}s</div>
          <div className="flex justify-end">
            <div
              onClick={() => previousPage(page)}
              className={`p-2 mr-3 rounded-full cursor-pointer ${
                page > 1 ? 'bg-gray-700' : 'bg-gray-900 text-gray-600'
              }`}
            >
              <HiOutlineChevronLeft size={16} />
            </div>
            <div className="pt-1 text-lg">
              {start} to {endTokenId}
            </div>
            <div
              onClick={() => nextPage(page, paginatedAssets)}
              className={`p-2 ml-3 rounded-full cursor-pointer ${
                page < paginatedAssets?.totalPages ? 'bg-gray-700' : 'bg-gray-900 text-gray-600'
              }`}
            >
              <HiOutlineChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
        {assets.map((asset, i) => (
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
  )
}

export default AssetList
