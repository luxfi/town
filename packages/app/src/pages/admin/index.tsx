import _ from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Input from '../../components/Input'
import { classNames, isSameAddress } from '../../functions'
import { useActiveWeb3React, useContract } from '../../hooks'

export default function Admin() {
  const { account } = useActiveWeb3React()
  const app = useContract('App')
  const router = useRouter()
  const [offlineBidder, setOfflineBidder] = useState('')
  const market = useContract('Market')

  // useEffect(() => {
  //   app.owner().then((owner) => {
  //     if (!isSameAddress(owner, account)) {
  //       router.push('/404')
  //     }
  //   })
  // }, [account])

  const onClickWhitelist = () => {
    market.setOfflineBidder(offlineBidder, true).then(console.log)
  }

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12 " maxWidth="6xl">
      <Head>
        <title>Admin | Lux Town</title>
        <meta name="description" content="Lux Town" />
      </Head>

      <div>
        <h3>Offline Bidder Whitelist</h3>

        <div className="relative flex items-center w-full mb-4">
          {/* <Input.Address
              className="w-full p-3 text-2xl rounded bg-dark-700 focus:ring focus:ring-indigo-600"
              value={offlineBidder}
              onUserInput={setOfflineBidder}
              placeholder="Wallet Address"
            /> */}

          <input
            value={offlineBidder}
            onChange={(event) => {
              setOfflineBidder(event.target.value.replace(/\s+/g, ''))
            }}
            // universal input options
            inputMode="text"
            title="Wallet Address or ENS name"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Wallet Address or ENS name"
            pattern="^(0x[a-fA-F0-9]{40})$"
            // text-specific options
            type="text"
            className={classNames(
              // 'text-right',
              'font-medium bg-transparent whitespace-nowrap overflow-ellipsis flex-auto'
              // className
            )}
          />

          <Button
            variant="outlined"
            color="gray"
            size="sm"
            onClick={onClickWhitelist}
            className="absolute right-2 focus:ring focus:ring-indigo-600"
          >
            Whitelist Address
          </Button>
        </div>
      </div>
    </Container>
  )
}
