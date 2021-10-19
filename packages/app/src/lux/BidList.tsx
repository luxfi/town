import { useState } from 'react'
import { BidResponse } from './types'
import Bid from './Bid'
import { useQuery, gql } from '@apollo/client'
import { usePrice } from './state'

const GET_BIDS = gql`
  query GetBids($where: Bid_filter, $first: Int) {
    bids(where: $where) {
      id
      amount
      createdAtTimestamp
      currency {
        id
      }
      bidder {
        id
      }
    }
  }
`

export type BidFilter = {
  media?: string
  bidder?: string
}

export type BidListProps = {
  where?: BidFilter
  title?: string
}

const BidList = ({ where, title }: BidListProps) => {
  const { getUsdAmount } = usePrice()
  const { loading, error, data } = useQuery(GET_BIDS, {
    variables: {
      where: {
        ...where,
        bidder: where?.bidder?.toLowerCase(),
        media: where?.media?.toLowerCase(),
      },
    },
    fetchPolicy: 'no-cache',
    pollInterval: 10000,
  });

  const bids = data?.bids || []

  return (
    <>
      {bids.length > 0 && (
        <div className="px-4 py-3 mt-10 bg-black rounded-lg">
          {title && <div className="pb-2 text-indigo-500">{title}</div>}
          {bids.map((bid: BidResponse) => <Bid key={bid.id} bid={bid} getUsdAmount={getUsdAmount} />)}
        </div>
      )}
    </>)
}

export default BidList
