import { GraphAsk } from './types'
import AskItem from './AskItem'
import { useQuery, gql } from '@apollo/client'
import { usePrice } from './state'
import { useRouter } from 'next/router'

const GET_ASKS = gql`
  query GetAsks($where: Ask_filter, $first: Int) {
    asks(where: $where) {
      id
      amount
      createdAtTimestamp
      currency {
        id
      }
      owner {
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

export type AskFilter = {
  media?: string
  owner?: string
}

export type AskListProps = {
  where?: AskFilter
  title?: string
  showToken?: boolean
  empty?: JSX.Element
}

const AskList = ({ where, empty, showToken }: AskListProps) => {
  const router = useRouter()
  const { getUsdAmount } = usePrice()
  const { loading, error, data } = useQuery(GET_ASKS, {
    variables: {
      where: {
        ...where,
        media: where?.media?.toLowerCase(),
        owner: where?.owner?.toLowerCase(),
      },
    },
    fetchPolicy: 'no-cache',
    pollInterval: 10000,
  })

  const asks = data?.asks || []

  const onClick = (ask: GraphAsk) => {
    router.push(`${router.pathname}?tokenId=${ask.media.id}`, undefined, { shallow: true })
  }

  return (
    <div className="AskList">
      {asks.length > 0 ? (
        asks.map((ask: GraphAsk) => (
          <div className="my-3" key={ask.id}>
            <AskItem ask={ask} getUsdAmount={getUsdAmount} showToken={showToken} onClick={onClick} />
          </div>
        ))
      ) : empty ? (
        empty
      ) : (
        <div className="py-3">No asks yet.</div>
      )}
    </div>
  )
}

export default AskList
