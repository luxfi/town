// Global constants injected during build
const ZK={}
const CHAIN='0x38'

const actions = {
  BOUGHT_EGG: 'Bought Egg',
  BREED_ANIMALS: 'Breed Animals',
  BURNED_TOKEN: 'Burned Token',
  FREE_ANIMAL: 'Free Animal',
  HATCHED_EGG: 'Hatched Egg',
  ASK_CREATED: 'Ask Created',
  PLACE_BID: 'Placed Bid',
}

// Get this enviroment's ZK contract
async function getZooToken() {
  const web3 = Moralis.web3ByChain(CHAIN)
  return new web3.eth.Contract(ZK.abi, ZK.address)
}

// Get this enviroment's ZK contract
async function getZooKeeper() {
  const web3 = Moralis.web3ByChain(CHAIN)
  return new web3.eth.Contract(ZK.abi, ZK.address)
}

// Query for a specific Animal
async function getAnimal(tokenID) {
  const Animals = Moralis.Object.extend('Animals')
  const query = new Moralis.Query(Animals)
  query.equalTo('tokenID', tokenID)
  return await query.first();
}

// Query for a specific Egg
async function getEgg(eggID) {
  const Eggs = Moralis.Object.extend('Eggs')
  const query = new Moralis.Query(Eggs)
  query.equalTo('tokenID', eggID)
  return await query.first();
}

// Get latest token information from ZK
async function getToken(tokenID) {
  const zooKeeper = await getZooKeeper()
  return await zooKeeper.methods.tokens(tokenID).call()
}

// Is current request confirmed
function confirmed(request) {
  return request.object.get('confirmed')
}

function setCommon(entity, { object }) {
  entity.set('owner', object.get('from'))
  entity.set('from', object.get('from'))
  entity.set('blockNumber', object.get('block_number'))
  entity.set('transactionHash', object.get('transaction_hash'))
  entity.set('timestamp', Date.now())
}

// Instantiate a new Animal
function newAnimal(request) {
  const Animals = Moralis.Object.extend('Animals')
  const animal = new Animals()
  setCommon(animal, request)
  return animal
}

// Instantiate a new Egg
function newEgg(request) {
  const Eggs = Moralis.Object.extend('Eggs')
  const egg = new Eggs()
  setCommon(egg, request)
  return egg
}

// Instantiate a new Transaction
function newTransaction(request) {
  const Transactions = Moralis.Object.extend('Transactions')
  const tx = new Transactions()
  setCommon(tx, request)
  return tx
}

Moralis.Cloud.afterSave('BuyEgg', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const eggID = parseInt(request.object.get('eggID')) // new Token ID

  // Pending confirmation on chain
  if (!confirmed(request)) {
    const egg = newEgg(request)
    egg.set('tokenID', eggID)
    egg.set('kind', 0)
    egg.set('type', 'basic')
    egg.set('interactive', true)
    egg.set('hatched', false)
    await egg.save()
    logger.info(`Egg ${eggID} saved at ${Date.now()}`)
    return
  }

  // Confirmed on chain, update with token data
  const egg = await getEgg(eggID)
  if (!egg){
      logger.error(`BuyEgg, No egg found for id: ${eggID}`)
      return;
  }

  const tok = await getToken(eggID)
  if (!tok){
      logger.error(`Hatch, No tok found for id: ${tokenID}`)
      return;
  }

  egg.set('tokenURI', tok.data.tokenURI)
  egg.set('metadataURI', tok.data.metadataURI)
  egg.set('rarity', tok.rarity.name)
  await egg.save()
  logger.info(`Egg ${eggID} saved at ${Date.now()}`)

  const tx = newTransaction(request)
  tx.set('action', actions.BOUGHT_EGG)
  tx.set('tokenID', eggID)
  await tx.save()

  logger.info(`Egg ${eggID} saved at ${Date.now()}`)
})

Moralis.Cloud.afterSave('Hatch', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const eggID = parseInt(request.object.get('eggID')) // Egg hatching will be burned
  const tokenID = parseInt(request.object.get('tokenID')) // New Animal minted

  const egg = await getEgg(eggID)
  if (!egg){
      logger.error(`Hatch, No egg found for id: ${eggID}`)
      return;
  }
  if (!confirmed(request)) {
    // Update egg state
    egg.set('animalID', tokenID)
    egg.set('hatched', true)
    egg.set('interactive', false)
    await egg.save()

    // Set initial animal state
    const animal = newAnimal(request)
    animal.set('tokenID', tokenID)
    animal.set('eggID', eggID)
    await animal.save()

    logger.info(`Hatch Egg ${eggID} saved at ${Date.now()}`)
    return
  }

  // Update Egg
  egg.set('hatched', true)
  egg.set('interactive', true)
  await egg.save()

  // Update Animal with confirmed state
  const animal = await getAnimal(tokenID)
  if (!animal){
      logger.error(`Hatch, No animal found for id: ${tokenID}`)
      return;
  }

  const tok = await getToken(tokenID)
  if (!tok){
      logger.error(`Hatch, No tok found for id: ${tokenID}`)
      return;
  }

  animal.set('kind', parseInt(tok.kind))
  animal.set('tokenURI', tok.data.tokenURI)
  animal.set('metadataURI', tok.data.metadataURI)
  animal.set('rarity', tok.rarity.name)
  animal.set('yield', parseInt(tok.rarity.yield))
  animal.set('boost', parseInt(tok.rarity.boost))
  animal.set('name', tok.name)
  animal.set('listed', false)
  animal.set('revealed', false)
  await animal.save()

  const tx = newTransaction(request)
  tx.set('action', actions.HATCHED_EGG)
  tx.set('eggID', eggID)
  tx.set('tokenID', tokenID)
  await tx.save()

  logger.info(`Hatched new ${tok.name} (${tokenID}) from ${eggID}`)
})

Moralis.Cloud.afterSave('Breed', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const eggID = parseInt(request.object.get('eggID')) // new Hybrid Egg
  const parentA = parseInt(request.object.get('parentA')) // parent A ID
  const parentB = parseInt(request.object.get('parentB')) // parent B ID
  const now = Date.now()

  logger.info(`Breed ${eggID}, ${parentA}, ${parentB}`)

  if (!confirmed(request)) {
    // Save new Hybrid Egg
    const egg = newEgg(request)
    egg.set('tokenID', eggID)
    egg.set('kind', 2)
    egg.set('type', 'hybrid')
    egg.set('interactive', false)
    egg.set('hatched', false)
    egg.set('parentA', parentA)
    egg.set('parentB', parentB)
    await egg.save()

    // Update breeding time on animals
    const pA = await getAnimal(parentA)
    pA.set('lastBred', now)

    if (pA['breedCount'] === undefined) {
      pA['breedCount'] = 0
    }

    pA.set('breedCount', pA['breedCount'] + 1)
    await pA.save()

    const pB = await getAnimal(parentB)
    pB.set('lastBred', now)

    if (pB['breedCount'] === undefined) {
      pB['breedCount'] = 0
    }

    pB.set('breedCount', pB['breedCount'] + 1)
    await pB.save()

    logger.info(`Hybrid Egg ${eggID} hatched, pending confirmation`)
    return
  }

  // confirmed, set to interactive
  const egg = await getEgg(eggID)
  if (!egg){
      logger.error(`No egg found for id: ${eggID}`)
      return;
  }
  // const tok = await getToken(eggID)
  egg.set('interactive', true)
  // egg.set('tokenURI', tok.data.tokenURI)
  // egg.set('metadataURI', tok.data.metadataURI)
  // egg.set('rarity', tok.rarity.name)
  await egg.save()

  const tx = newTransaction(request)
  tx.set('action', actions.BREED_ANIMALS)
  tx.set('parentA', parentA)
  tx.set('parentB', parentB)
  tx.set('tokenID', eggID)
  await tx.save()

  logger.info(`Hybrid Egg ${tokenID} saved successfully`)
})

// Update token state after burn
Moralis.Cloud.afterSave('Burn', async (request) => {
  if (!confirmed(request)) return

  const logger = Moralis.Cloud.getLogger()
  const tokenID = parseInt(request.object.get('tokenID')) // Token burning

  const tx = newTransaction(request)
  tx.set('action', actions.BURNED_TOKEN)
  tx.set('tokenID', tokenID)
  await tx.save()

  logger.info(`Burned ${tokenID}`)
})

// Update animal state after Free
Moralis.Cloud.afterSave('Free', async (request) => {
  if (!confirmed(request)) return

  const logger = Moralis.Cloud.getLogger()
  const tokenID = parseInt(request.object.get('tokenID')) // Animal being freed

  const animal = await getAnimal(tokenID)
  if (!animal){
      logger.error(`Free, No animal found for id: ${tokenID}`)
      return;
  }
  animal.set('burned', true)
  animal.set('freed', true)
  await animal.save()

  const tx = newTransaction(request)
  tx.set('action', actions.FREE_ANIMAL)
  tx.set('tokenID', tokenID)
  await tx.save()

  logger.info(`Animal ${name} (${tokenID} released into Wild`)
})

Moralis.Cloud.afterSave('Swap', async (request) => {
  if (!confirmed(request)) return

  const logger  = Moralis.Cloud.getLogger()
  const chainID = parseInt(request.object.get('chainID'))
  const from    = request.object.get('from')
  const to      = request.object.get('to')
  const amount  = parseInt(request.object.get('amount'))

  if (chainID == CHAIN) {
    logger.info(`Minting ${amount} -> ${to}`)
  }

  logger.info(`Swap ${from} ${to} ${amount} ${chainID}`)
})

Moralis.Cloud.afterSave('AskCreated', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  logger.into(request);

  const tx = newTransaction(request)
  tx.set('action', actions.ASK_CREATED)
  tx.set('tokenID', tokenID)
  await tx.save()
})

Moralis.Cloud.define('getAverageGasPrice', async function (request) {
  const query = new Moralis.Query('BscTransactions')
  const pipeline = [
    {
      group: {
        // group by "from_address"
        objectId: '$from_address',
        // add computed property avgGas
        // get average and convert wei to gwei
        avgGas: { $avg: { $divide: ['$gas_price', 1000000000] } },
      },
    },
    { sort: { avgGas: -1 } }, // sort by avgGas high to low
    { limit: 10 }, // only return top 10 results
  ]

  // the master key is required for aggregate queries
  return await query.aggregate(pipeline, { useMasterKey: true })
})

// This is a convenience function to drop the tables
Moralis.Cloud.define('dropTables', async (request) => {
  const logger = Moralis.Cloud.getLogger()

  // Wipe out all data
  const classNames = ['User', 'Breed', 'Burn', 'BuyEgg', 'Free', 'Hatch', 'Mint', 'Eggs', 'Animals', 'Transactions']

  for (const name of classNames) {
    const Class = Moralis.Object.extend(name)
    const query = new Moralis.Query(Class)
    const results = await query.limit(1000).find()

    logger.info(`Dropping table ${name}`)
    for (let i = 0; i < results.length; i++) {
      await results[i].destroy()
    }
  }
})

Moralis.Cloud.define('refreshEggs', async (request) => {
  const BuyEgg = Moralis.Object.extend('BuyEgg')
  const query = new Moralis.Query(BuyEgg)
  const results = await query.limit(10000).find()
  for (let i = 0; i < results.length; i++) {
    await results[i].save()
  }
})

Moralis.Cloud.define('transactions', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const { account, tokenID, excludeBurned, limit } = request.params

  const Transactions = Moralis.Object.extend('Transactions')
  const query = new Moralis.Query(Transactions)

  query.limit(!limit || limit > 1000 ? 1000 : limit)
  query.descending('createdAt')

  if (account) {
    query.equalTo('from', account.toLowerCase())
  }

  logger.info('transactions param tokenID', tokenID)

  if (tokenID) {
    query.equalTo('tokenID', tokenID)
  }

  const results = await query.find()

  return results.filter(tx => {
    return excludeBurned ? tx.get('action') !== actions.BURNED_TOKEN : true
  }).map(tx => {
    const action = tx.get('action')
    const txHash = tx.get('transactionHash')
    const url = `https://testnet.bscscan.com/tx/${txHash}`
    return {
      id: tx.get('objectId'),
      from: tx.get('from'),
      action: action,
      hash: txHash,
      url: url,
      createdAt: tx.get('createdAt').toISOString(),
      blockNumber: tx.get('blockNumber'),
      timestamp: tx.get('timestamp'),
      tokenID: tx.get('tokenID'),
    }
  })
})

// Helper to return latest price from CMC
Moralis.Cloud.define('zooPrice', async (request) => {
  let zooPrice
  const CMC_ZOO_TOKEN_ID = 11556
  const amount = parseInt(request.params.amount || 0);
  const ZooPrice = Moralis.Object.extend('ZooPrice')
  const query = new Moralis.Query(ZooPrice)
  zooPrice = await query.first()
  // Only check every 30 seconds
  if (zooPrice && zooPrice.get('timestamp') + (1000 * 30) < Date.now()) {
    const usdPrice = zooPrice.get('quote')?.USD?.price || 0
    return {
      ...zooPrice,
      ...zooPrice.attributes,
      usdAmount: (amount * parseFloat(usdPrice)).toFixed(2),
    }
  }

  // Fetch latest zoo price
  const res = await Moralis.Cloud.httpRequest({
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    params: 'slug=zoo&convert=USD',
    headers: {
      'X-CMC_PRO_API_KEY': '0ebe5b28-b584-4a39-b292-e0b3e639fd58',
      'Accept': 'application/json',
    }
  })

  const { data } = JSON.parse(res.text)
  zooPrice = data[CMC_ZOO_TOKEN_ID]
  const usdPrice = zooPrice?.quote?.USD?.price || 0
  zooPrice = new ZooPrice({...zooPrice, usdPrice })
  zooPrice.set('timestamp', Date.now())
  await zooPrice.save()
  return {
    ...zooPrice,
    ...zooPrice.attributes,
    usdAmount: (amount * parseFloat(usdPrice)).toFixed(2),
  }
})
