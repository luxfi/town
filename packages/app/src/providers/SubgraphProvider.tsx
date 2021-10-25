import { ChainId } from '@luxdefi/sdk'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { useActiveWeb3React } from '../hooks'

const SUBGRAPH_LOCALHOST = 'http://127.0.0.1:8000/subgraphs/name/luxdefi/luxtown'
const SUBGRAPH_ROPSTEN = 'https://api.thegraph.com/subgraphs/name/luxdefi/luxtown-ropsten'

const subgraphUri = {
  [ChainId.HARDHAT]: SUBGRAPH_LOCALHOST,
  [ChainId.ROPSTEN]: SUBGRAPH_ROPSTEN,
}

export const SubgraphProvider = ({ children }) => {
  const { chainId } = useActiveWeb3React()
  const uri = subgraphUri[chainId]
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  })
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
