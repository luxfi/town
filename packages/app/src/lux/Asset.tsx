import { ChainId, Token } from '@luxdefi/sdk'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { GetTriggerProps } from 'react-morphing-modal/dist/types'
import Player from 'react-player'
import { NFT_ATM, NFT_CASH, NFT_VALIDATOR, NFT_WALLET } from '../functions/assets'
import { useContract } from '../hooks'


export type AssetProps = {
  tokenId: number
  type: string
  image: string
  video: string
  className?: string
  height?: number
  width?: number
  showPrice?: boolean
  autoPlay?: boolean
  getTriggerProps?: GetTriggerProps
} & React.HTMLAttributes<HTMLDivElement>

const modalOffset = {
  [NFT_VALIDATOR]: 170,
  [NFT_ATM]: 40,
  [NFT_WALLET]: 140,
  [NFT_CASH]: 150,
}

// TODO: MOVE THIS SHIT
const currencyMap = (addr: string): Token => {
  switch (addr) {
    case `0x0000000000000000000000000000000000000000`:
    default:
      return new Token(ChainId.HARDHAT, '0x0000000000000000000000000000000000000000', 18, 'ETH', 'Ethereum')
      break;
  }
}

const Asset = (props: AssetProps) => {
  const {tokenId, showPrice} = props;
  const market = useContract('Market')
  const [currentAskPrice, setCurrentAskPrice] = useState(BigNumber.from(0))
  const [currency, setCurrency] = useState("ETH")

  const updateAssetDetails = useCallback(() => {
    async () => {
    if (!tokenId || !showPrice) return;
    const [amount, currency] = await market.currentAskForToken(tokenId);
    setCurrentAskPrice(amount);
    // TODO: Check on what currencies are accepted?
    // TODO: Accept tokens from @luxdefi/sdk
    const token = currencyMap(currency);
    setCurrency(token.symbol);
  }}, [tokenId, showPrice, market]);

  useEffect(() => {
    updateAssetDetails();
  }, [tokenId, showPrice, currentAskPrice, currency, updateAssetDetails])

  return (
    <div
      className={`Asset ${props.className || ''} ${props.getTriggerProps ? 'cursor-pointer' : ''}`}
      {...(props.getTriggerProps ? props.getTriggerProps({ id: props.tokenId }) : {})}
    >
      {props.autoPlay ? (
        <Player url={props.video} playing={true} loop width={'auto'} height={'auto'} style={{ height: 'auto' }} />
      ) : (
        <img src={props.image} alt={`${props.type} ${props.tokenId}`} />
      )}
      <div
        className={`w-full pb-5 text-center backdrop-filter backdrop-opacity video-overlay`}
        style={{
          position: props.showPrice ? 'relative' : 'static',
          bottom: props.showPrice ? modalOffset[props.type] : 60,
        }}
      >
        <div>
          <span className="text-lg text-gray-300">{props.type}</span>
          <span className="px-2 py-1 ml-2 text-xs font-bold text-black bg-gray-300 rounded-full lux-font Asset__token-id">
            {props.tokenId}
          </span>
        </div>
        {props.showPrice && <div className="px-2 py-1 text-2xl text-indigo-500 rounded text-bold">Price {currentAskPrice.toNumber()} {currency}</div>}
      </div>
    </div>
  )
}

export default Asset
