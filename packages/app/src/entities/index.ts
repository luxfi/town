import { I18n } from '@lingui/core'
import { remoteLoader } from '@lingui/remote-loader'

export { default as Fraction } from './Fraction'
export { default as BigNumberMath } from './BigNumberMath'
export { default as KashiCooker } from './KashiCooker'
export { ChainlinkOracle, SushiSwapTWAP0Oracle, SushiSwapTWAP1Oracle } from './Oracle'
import * as plurals from "make-plural/plurals";
import { en, es, sr } from 'make-plural/plurals'
export async function loadTranslation(locale: string, sessionId: string, isProduction = true) {
    console.log('hit me nw')
    let data
    try {
        // Load messages from AWS, use q session param to get latest version from cache
        const resp = await fetch(
            `https://d3l928w2mi7nub.cloudfront.net/${locale}.json?q=${sessionId}`
        );
        const remoteMessages = await resp.json();
        console.log('remoteMessages', remoteMessages)
        const messages = remoteLoader({
            messages: remoteMessages,
            format: "minimal",
        });
        return messages
    } catch {
        // Load fallback messages
        const isProduction = process.env.NODE_ENV === "production";


        if (isProduction) {
            const { messages } = await import(`../../locale/${locale}.json`);
            console.log('is production', messages)
            return messages
        } else {
            console.log('locale', locale)
            // const newMessages = await import(`../../locale/${locale}.json`);
            // console.log("hitting newMessages", newMessages);
            const { messages } = await import(`../../locale/${locale}.json`);

            // const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
            return messages

        }
    }
}


export function initTranslation(i18n: I18n): void {
    i18n.loadLocaleData({
        en: { plurals: en },
        es: { plurals: es },
        pseudo: { plurals: en }
    })
}