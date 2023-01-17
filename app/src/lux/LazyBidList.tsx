import { GraphBid } from './types'
import LazyBidItem from './LazyBidItem'
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

export type LazyBidFilter = {
  dropId?: number
  tokenTypeName?: string
  bidder?: string
}

export type LazyBidListProps = {
  where?: LazyBidFilter
  showToken?: boolean
  onClick?: any
  empty?: JSX.Element
}

const LazyBidList = ({ where, empty, showToken, onClick }: LazyBidListProps) => {
  const { getUsdAmount } = usePrice()
  const { loading, error, data } = useQuery(GET_BIDS, {
    variables: {
      where: {
        ...where,
        bidder: where?.bidder?.toLowerCase(),
      },
    },
    fetchPolicy: 'no-cache',
    pollInterval: 10000,
  })

  const bids = data?.bids || []

  return (
    <div className="LazyBidList">
      {bids.length > 0 ? (
        bids.map((bid: GraphBid) => (
          <div className="my-3" key={bid.id}>
            <LazyBidItem bid={bid} getUsdAmount={getUsdAmount} showToken={showToken} onClick={onClick} />
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

export default LazyBidList
