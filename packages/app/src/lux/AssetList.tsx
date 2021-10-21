import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GetTriggerProps, OpenModal, TriggerProps } from 'react-morphing-modal/dist/types'
import { useContract } from '../hooks'
import Asset from './Asset'
import _ from 'lodash'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { newNft } from '../functions/assets'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const getPages = (total: number, perPage: number) => {
  var chunks: number[] = Array(Math.floor(total / perPage)).fill(perPage)
  var remainder = total % perPage
  if (remainder > 0) {
    chunks.push(remainder)
  }
  return chunks
}

// const getPaginatedAssets = (
//   type: string,
//   firstTokenId: number,
//   totalMinted: number,
//   page: number,
//   perPage: number = 6
// ): PaginatedAssets => {
//   const pages = getPages(totalMinted, perPage)
//   const totalPages = pages.length
//   const pageQuantity = pages[page - 1]
//   const start = page * perPage - perPage + firstTokenId
//   const end = start + pageQuantity
//   const endTokenId = end - 1
//   return {
//     type,
//     page,
//     start,
//     end,
//     endTokenId,
//     totalPages,
//     assets: _.range(start, end).map((tokenId) => newNft(tokenId, contentURI)),
//   }
// }

export enum ContentUriFilter {
  ATM = "atm",
  CASH = "cash",
  WALLET = "wallet",
  VALIDATOR = "validator",
}

export type MediaFilter = {
  owner?: string
  contentURI_contains?: ContentUriFilter,
}

const GET_ASSETS = gql`
  query GetAssets($where: Media_filter, $skip: Int, $first: Int, $orderBy: Media_orderBy) {
    medias(skip: $skip, first: $first, where: $where, orderBy: $orderBy) {
      id
      contentURI
      metadataHash
      owner {
        id
      }
    }
  }
`;

export type AssetListProps = {
  title: string
  tokenType?: string
  tokenName?: string
  perPage?: number
  cols?: number
  where?: MediaFilter
  orderBy?: string,
  className?: string
  autoPlay?: boolean
  animate?: boolean
  large?: boolean
  getTriggerProps?: GetTriggerProps
  onLoadAssets?: (assets: object[]) => void
  openModal?: OpenModal
} & React.HTMLAttributes<HTMLDivElement>

const AssetList = (props: AssetListProps) => {
  const router = useRouter()
  const where = props.where || {}
  const [totalPages, setTotalPages] = useState(1)
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(1)
  const [pageOffset, setPageOffset] = useState(0)
  const drop = useContract('Drop')
  const { perPage } = props

  const { loading, error } = useQuery(GET_ASSETS, {
    variables: {
      where: {
        ...where,
        owner: where.owner && where.owner.toLowerCase(),
      },
      orderBy: props.orderBy && props.orderBy || 'id',
      skip: pageOffset,
      first: perPage || 100,
    },
    onCompleted: ({ medias }) => {
      setAssets(medias)
      props.onLoadAssets && props.onLoadAssets(medias)
    }
  });

  useEffect(() => {
    drop.totalMinted(props.tokenName).then((totalMintedBn) => {
      setTotalPages(Math.ceil(totalMintedBn.toNumber() / perPage))
    })
  }, [props.tokenName])

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
          <div className="text-2xl text-indigo-600">{props.title}</div>
          <div className="flex justify-end">
            <div
              onClick={previousPage}
              className={`p-2 mr-3 rounded-full cursor-pointer ${
                page > 1 ? 'bg-gray-700' : 'bg-gray-900 text-gray-600'
              }`}
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
          </div>
        </div>
      <div className={`grid grid-cols-1 gap-5 md:grid-cols-${props.cols || 6}`}>
        {assets.map((asset, i) => (
          <Asset
            key={asset.id}
            tokenId={asset.id}
            contentURI={asset.contentURI}
            showPrice={false}
            animate={props.animate}
            large={props.large}
            onClick={() => onClick(asset.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default AssetList
