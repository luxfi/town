const fs = require('fs')
const spawn = require('child_process')
const Moralis = require('moralis/node')
const { APPLICATION_ID, MASTER_KEY, DEPLOYMENT, SUBDOMAIN } = require('./constants')

Moralis.initialize(APPLICATION_ID, null, MASTER_KEY)
Moralis.serverURL = `https://${SUBDOMAIN}:2053/server`

const ASSETS_FOLDER = __dirname + `/../assets`

const upload = async (name, mimeType) => {
    const validator = fs.readFileSync(`${ASSETS_FOLDER}/${name}`)

    const base64 = validator.toString('base64')
    const file = new Moralis.File(name, { base64 }, mimeType)
    const response = await file.saveIPFS({ useMasterKey: true })

    delete response._data
    delete response._source
    delete response._previousSave

    console.log('Uploaded: ', response)

    return response
}

const uploadToIPFS = async (uploadArgs = []) => {
    const response = {}
    for (const [name, mimeType] of uploadArgs) {
        response[name] = await upload(name, mimeType)
    }
    return response
}

    ; (async () => {
        try {
            const responses = await uploadToIPFS([
                ['validator.jpg', 'image/jpg'],
                ['wallet.jpg', 'image/jpg'],
                ['atm.jpg', 'image/jpg'],
                ['validator.mp4', 'video/mp4'],
                ['wallet.mp4', 'video/mp4'],
                ['atm.mp4', 'video/mp4'],
            ])

            fs.writeFileSync(`${ASSETS_FOLDER}/uploaded/${DEPLOYMENT}.json`, JSON.stringify(responses, null, 2))

            console.log(`Uploaded data saved to ./uploaded/${DEPLOYMENT}.json`)
            console.log(`Copied ./uploaded to ../app/src/uploaded`)
        } catch (error) {
            console.log(error)
        }
    })()