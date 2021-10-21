import { BidResponse } from './types'
import BidItem from './BidItem'

const BidEditable = (bid: BidResponse) => {
  return (
    <div className="BidEditable">
      <BidItem bid={bid} />
    </div>
  )
}

export default BidEditable
