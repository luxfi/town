import { DEFAULT_METAMASK_CHAIN_ID, NETWORK_ICON, NETWORK_LABEL, SUPPORTED_NETWORKS } from '../../config/networks'
import React, { FC, Fragment } from 'react'
import { Trans, useLingui } from '@lingui/react'

import { ChainId } from '@luxdefi/sdk'
import HeadlessUIModal from '../../components/Modal/HeadlessUIModal'
import Image from 'next/image'
import NavLink from '../../components/NavLink'
import Typography from '../../components/Typography'
import cookie from 'cookie-cutter'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'

interface NetworkGuardProps {
  networks: ChainId[]
}

const Component: FC<NetworkGuardProps> = ({ children, networks = [] }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()

  const link = (
    <NavLink href="/swap">
      <a className="text-blue focus:outline-none">{i18n._(t`home page`)}</a>
    </NavLink>
  )

  return (
    <>
      <HeadlessUIModal isOpen={!!account && !networks.includes(chainId)} onDismiss={() => null}>
        <div className="flex flex-col justify-center gap-7">
          <Typography variant="h1" className="max-w-2xl text-center text-white" weight={700}>
            {i18n._(t`Roll it back - this feature is not yet supported on ${NETWORK_LABEL[chainId]}.`)}
          </Typography>
          <Typography className="text-center">
            <Trans
              id="Either return to the {link}, or change to an available network."
              values={{ link }}
              components={Fragment}
            />
          </Typography>
          <Typography className="uppercase text-white text-center text-lg tracking-[.2rem]" weight={700}>
            {i18n._(t`Available Networks`)}
          </Typography>
          <div
            className={`grid gap-5 md:gap-10 md:grid-cols-[${Math.min(6, networks.length)}] grid-cols-[${Math.min(
              3,
              networks.length
            )}]`}
          >
            {networks.map((key: ChainId, idx: number) => (
              <button
                className="flex flex-col items-center justify-start gap-2 text-primary hover:text-white"
                key={idx}
                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (DEFAULT_METAMASK_CHAIN_ID.includes(key)) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: params.chainId }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
              >
                <div className="w-[40px] h-[40px]">
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-md filter drop-shadow-currencyLogo"
                    width="40px"
                    height="40px"
                  />
                </div>
                <Typography className="text-sm">{NETWORK_LABEL[key]}</Typography>
              </button>
            ))}
          </div>
        </div>
      </HeadlessUIModal>
      {children}
    </>
  )
}

const NetworkGuard = (networks: ChainId[]) => {
  return ({ children }) => <Component networks={networks}>{children}</Component>
}

export default NetworkGuard
