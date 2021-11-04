import { TokenType } from '../types/schema'
import { TokenTypeAdded } from '../types/Drop/Drop'
import { store, log } from '@graphprotocol/graph-ts'
import { createTokenType } from './helpers'

export async function handleTokenTypeAdded(event: TokenTypeAdded): Promise<void> {

    const { name, kind } = event.params.tokenType

    const tokenType = await TokenType.load(name)

    if (tokenType === null) {

        createTokenType(
            name,
            kind.toString(),
            event.transaction.hash.toHexString()
        )

        // event.transaction.hash.toHexString()
    }

    log.info('handleTokenTypeAdded', [event.params.tokenType.name]);

}
