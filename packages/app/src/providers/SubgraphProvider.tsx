import { ChainId } from '@luxdefi/sdk'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { useActiveWeb3React } from '../hooks'

const SUBGRAPH_LOCALHOST = 'http://127.0.0.1:8000/subgraphs/name/luxdefi/luxtown'
const SUBGRAPH_ROPSTEN = 'https://api.thegraph.com/subgraphs/name/luxdefi/luxtown-ropsten'
const SUBGRAPH_MAINNET = 'https://api.thegraph.com/subgraphs/name/luxdefi/luxtown-mainnet'

const createClient = (uri) => {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  })
}

const clients = {
  [ChainId.HARDHAT]: createClient(SUBGRAPH_LOCALHOST),
  [ChainId.ROPSTEN]: createClient(SUBGRAPH_ROPSTEN),
  [ChainId.MAINNET]: createClient(SUBGRAPH_MAINNET),
}

const fallbackClient = process.env.NODE_ENV === 'development' ? clients[ChainId.HARDHAT] : clients[ChainId.ROPSTEN]

export const SubgraphProvider = ({ children }) => {
  const { chainId } = useActiveWeb3React()
  const client = clients[chainId] || fallbackClient
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
