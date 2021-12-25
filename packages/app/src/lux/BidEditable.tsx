import { GraphBid } from './types'
import BidItem from './BidItem'

const BidEditable = (bid: GraphBid) => {
  return (
    <div className="BidEditable">
      <BidItem bid={bid} />
    </div>
  )
}

export default BidEditable
