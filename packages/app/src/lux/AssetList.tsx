import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import Link from 'next/link'
import { useContract } from '../hooks'
import Asset from './Asset'
import _ from 'lodash'
import { newNft } from '../functions/assets'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useTokenTypes } from './state'

const getPages = (total: number, perPage: number) => {
  var chunks: number[] = Array(Math.floor(total / perPage)).fill(perPage)
  var remainder = total % perPage
  if (remainder > 0) {
    chunks.push(remainder)
  }
  return chunks
}

export type MediaFilter = {
  owner?: string
  contentURI_contains?: string
  metadataURI_contains?: string
}

const GET_ASSETS = gql`
  query GetAssets($where: Media_filter, $skip: Int, $first: Int, $orderBy: Media_orderBy) {
    medias(skip: $skip, first: $first, where: $where, orderBy: $orderBy) {
      id
      contentURI
      metadataURI
      metadataHash
      owner {
        id
      }
    }
  }
`

export type AssetListProps = {
  title: string
  tokenType?: string
  tokenName?: string
  totalMinted?: number
  perPage?: number
  cols?: number
  where?: MediaFilter
  orderBy?: string
  className?: string
  autoPlay?: boolean
  animate?: boolean
  large?: boolean
  empty?: JSX.Element
  getTriggerProps?: GetTriggerProps
  onLoadAssets?: (assets: object[]) => void
  openModal?: OpenModal
} & React.HTMLAttributes<HTMLDivElement>

const AssetList = ({
  animate,
  cols,
  tokenName,
  totalMinted,
  title,
  large = false,
  empty,
  where = {},
  perPage = 6,
  orderBy = 'id',
  onLoadAssets,
}: AssetListProps) => {
  const router = useRouter()
  const [totalPages, setTotalPages] = useState(1)
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(1)
  const [pageOffset, setPageOffset] = useState(0)
  
  const { loading, error } = useQuery(GET_ASSETS, {
    variables: {
      where: {
        ...where,
        owner: where.owner && where.owner.toLowerCase(),
      },
      orderBy,
      skip: pageOffset,
      first: perPage || 100,
      fetchPolicy: 'no-cache',
      pollInterval: 10000,
    },
    onCompleted: ({ medias }) => {
      setAssets(medias)
      onLoadAssets && onLoadAssets(medias)
    },
  })

  useEffect(() => {
    if (totalMinted) {
      setTotalPages(Math.ceil(totalMinted / perPage))
    }
  }, [totalMinted])

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }, [page, totalPages])

  useEffect(() => {
    setPageOffset(page * perPage - perPage)
  }, [page])

  const onClick = (tokenId: number | string) => {
    router.push(`${router.pathname}?tokenId=${tokenId}`, undefined, { shallow: true })
  }

  return (
    <div className={`AssetList pb-10 mb-10 border-b-gray-900 border-b-2`}>
      <div className="grid grid-cols-2 gap-5">
        <div className="text-2xl text-indigo-600">{title}</div>
        {totalPages > 1 && <div className="flex justify-end">
          <div
            onClick={previousPage}
            className={`p-2 mr-3 rounded-full cursor-pointer ${page > 1 ? 'bg-gray-700' : 'bg-gray-900 text-gray-600'}`}
          >
            <HiOutlineChevronLeft size={16} />
          </div>
          <div className="pt-1 text-lg">
            Page {page} of {totalPages}
          </div>
          <div
            onClick={nextPage}
            className={`p-2 ml-3 rounded-full cursor-pointer ${
              page < totalPages ? 'bg-gray-700' : 'bg-gray-900 text-gray-600'
            }`}
          >
            <HiOutlineChevronRight size={16} />
          </div>
        </div>}
      </div>
      {assets.length > 0 ? (
        <div className={`grid grid-cols-1 gap-5 md:grid-cols-${cols || 6}`}>
          {assets.map((asset, i) => (
            <Asset
              key={asset.id}
              tokenId={asset.id}
              contentURI={asset.contentURI}
              showPrice={false}
              animate={animate}
              large={large}
              onClick={() => onClick(asset.id)}
            />
          ))}
        </div>
      ) : (
        empty ? empty : <div className="py-3">Go to the <Link href="/market">Market</Link> to buy your first Lux NFT.</div>
      )}
    </div>
  )
}

export default AssetList
