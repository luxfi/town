import { useState } from 'react'
import { GraphBid } from './types'
import BidItem from './BidItem'
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
      media {
        id
        contentURI
        owner {
          id
        }
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
  showToken?: boolean
  onClick?: any
  empty?: JSX.Element
}

const BidList = ({ where, empty, showToken, onClick }: BidListProps) => {
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
  })

  const bids = data?.bids || []

  return (
    <div className="BidList">
      {bids.length > 0 ? (
        bids.map((bid: GraphBid) => (
          <div className="my-3" key={bid.id}>
            <BidItem bid={bid} getUsdAmount={getUsdAmount} showToken={showToken} onClick={onClick} />
          </div>
        ))
      ) : empty ? (
        empty
      ) : (
        <div className="py-3">No bids yet.</div>
      )}
    </div>
  )
}

export default BidList
