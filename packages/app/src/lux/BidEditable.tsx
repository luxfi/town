import { BidResponse } from './types'
import Bid from './Bid'

const BidEditable = (bid: BidResponse) => {
  return (
    <div className="BidEditable">
      <Bid {...bid} />
    </div>
  )
}

export default BidEditable
