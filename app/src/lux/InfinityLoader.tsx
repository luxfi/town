import Image from '../components/Image'

export const InfinityLoader = ({ alt = 'Pending Transaction', height = 32, width = 50 }) => {
  return <Image src="/animated-infinity.svg" alt={alt} height={height} width={width} />
}
