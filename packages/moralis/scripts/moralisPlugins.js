require('dotenv').config()

const axios = require('axios')
const fs = require('fs')
const utils = require('moralis-admin-cli/utils')
const { BASE_URI } = require('moralis-admin-cli/config')
const { restartServer } = require('moralis-admin-cli/commands/common')

const NETWORK = process.env.NETWORK ? process.env.NETWORK : 'hardhat'

const CHAIN_IDS = {
  hardhat: '0x539',
  testnet: '0x4',
  mainnet: '0x1',
}

const CHAIN_ID = CHAIN_IDS[NETWORK]
const SERVER_NAME = {
  hardhat: 'Hardhat',
  testnet: 'Testnet',
  mainnet: 'Mainnet',
}[NETWORK]

const DEPLOYMENT = {
  hardhat: 'localhost',
  testnet: 'testnet',
  mainnet: 'mainnet',
}[NETWORK]

const BASE_ABI_PATH = `${__dirname}/../../contracts/deployments/${DEPLOYMENT}`

const getContract = (contractName) => {
  const ABI_PATH = `${BASE_ABI_PATH}/${contractName}.json`

  return new Promise((resolve, reject) => {
    // read the abi
    fs.readFile(ABI_PATH, 'utf8', async function read(err, data) {

      // Check for errors
      if (err) {
        reject(`Error reading file from disk: ${err}`)
        return
      }

      const contract = JSON.parse(data)

      resolve(contract)
    })
  })
}

const getContractPlugins = (contract, contractName) => {
  const abiEvents = contract.abi.filter((item) => item.type == 'event')

  if (!abiEvents) {
    console.log('Could not read ABI')
  }

  // Function for fixing datatypes
  const fixType = (type) => (type == 'uint' ? 'uint256' : type)

  // function for getting the topic
  const getTopic = (item) => `${item.name}(${item.inputs.reduce((a, o) => (a.push(fixType(o.type)), a), []).join()})`

  const contractAddress = contract.address

  const plugins = [];

  // Loop through events in LuxKeeper ABI
  for (let i = 0; i < abiEvents.length; i++) {
    const event = abiEvents[i]
    const tableName = `${event.name}`
    const description = tableName
    const topic = getTopic(event)

    // Define the new plugin
    const plugin = {
      id: 6,
      path: './evm/events',
      order: 5,
      options: {
        sync_historical: true,
        description: description,
        abi: event,
        topic: topic,
        address: contractAddress,
        tableName: tableName,
        chainId: CHAIN_ID,
      },
    }

    console.log(`addPlugins: `, tableName, contractAddress)

    // Push the plugin to the list
    plugins.push(plugin)
  }

  return plugins;
}

const getPlugins = async (contractNames = []) => {
  // Ensure the default plugins are installed
  let plugins = [
    {
      id: 1,
      path: './evm/consumer',
      options: [],
    },
    {
      id: 2,
      path: './evm/historical/transactions',
      options: [],
    },
    {
      id: 3,
      path: './evm/blocks',
      options: [],
    },
    {
      id: 4,
      path: './evm/balances',
      options: [],
    },
    {
      id: 5,
      path: './convenience/index',
      options: [],
    },
  ]

  for (const contractName of contractNames) {
    plugins = plugins.concat(getContractPlugins(await getContract(contractName), contractName))
  }

  return plugins;
}

/**
 * Configures the events to subscribe to on a smart contract based on the abi file
 */
const addPlugins = async (contractNames = []) => {
  console.log(`addPlugins: Updating Plugins for ${NETWORK} contracts: ${contractNames.join(', ')}`)
  // Get credentials
  const apiKey = await utils.getApiKey()
  const apiSecret = await utils.getApiSecret()
  // Load servers
  const servers = await utils.getUserServers()

  if (servers.length == 0) {
    console.log('addPlugins: No servers found!')
    return
  }

  // Get the server to apply the event syncs to
  const server = servers.filter((item) => item.name == SERVER_NAME)[0]

  try {
    const plugins = await getPlugins(contractNames)

    // Post updated plugins to the api
    console.log(`\naddPlugins: Pushing contract events...`)

    await axios.post(`${BASE_URI}/api/cli/updateServerPlugins`, {
      apiKey,
      apiSecret,
      parameters: {
        serverId: server.id,
        plugins: JSON.stringify(plugins),
      },
    })

    console.log(`addPlugins: Successfully saved the contract events!`)

    // Restart server to apply sync
    await restartServer(apiKey, apiSecret, server)

  } catch (e) {
    console.log('addPlugins: Unexpected error')
    console.log(e)
  }
}

  /**
   * Configures the events to subscribe to on a smart contract based on the abi file
   */
  ; (async () => {
    await addPlugins(['App', 'Market']);
  })()
