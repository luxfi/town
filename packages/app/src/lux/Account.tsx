import React, { FC } from 'react'
import Copy from '../components/AccountDetails/Copy'
import ExternalLink from '../components/ExternalLink'
import Image from 'next/image'
import { ExternalLink as LinkIcon } from 'react-feather'
import Typography from '../components/Typography'
import { getExplorerLink } from '../functions/explorer'
import { shortenAddress } from '../functions'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useENSName from '../hooks/useENSName'

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({ size, src, alt, children }) => {
  return (
    <div className="flex flex-row items-end justify-center mr-2 flex-nowrap md:items-center">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  )
}

interface AccountProps {
  label?: string
  account?: string
  //   ENSName?: string
}

const Account: FC<AccountProps> = ({ label, account: overrideAccount }) => {
  const { i18n } = useLingui()
  const { chainId, account: activeAccount, connector } = useActiveWeb3React()

  const account = overrideAccount || activeAccount
  const { ENSName } = useENSName(account ?? undefined)

  return (
    <div className="flex flex-col justify-center space-y-3">
      {ENSName ? (
        <div className="bg-dark-800">
          <Typography>
            {label} {ENSName}
          </Typography>
        </div>
      ) : (
        <div className="py-2">
          <div className="flex items-center gap-2 space-x-3">
            <Typography>
              {label} {account && shortenAddress(account)}
            </Typography>
            {/* {chainId && account && (
              <ExternalLink
                color="blue"
                startIcon={<LinkIcon size={16} />}
                href={chainId && getExplorerLink(chainId, ENSName || account, 'address')}
              >
                <Typography variant="sm">{i18n._(t`View on explorer`)}</Typography>
              </ExternalLink>
            )}
            {account && (
              <Copy toCopy={account}>
                <Typography variant="sm">{i18n._(t`Copy Address`)}</Typography>
              </Copy>
            )} */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Account
