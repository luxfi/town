import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

import ExternalLink from '../ExternalLink'
import { I18n } from '@lingui/core'
import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NavLink from '../NavLink'
import Toggle from '../Toggle'
import { useAnimationModeManager } from '../../state/user/hooks'

const items = (i18n: I18n) => [
  {
    name: i18n._(t`About`),
    description: i18n._(t`Documentation for users of Lux.`),
    href: '#',
    external: true,
  },
  {
    name: i18n._(t`Dev`),
    description: i18n._(t`Documentation for developers of lux.`),
    href: 'https://dev.lux.town',
    external: true,
  },
  // {
  //   name: i18n._(t`Open Source`),
  //   description: i18n._(t`Sushi is a supporter of Open Source.`),
  //   href: 'https://github.com/sushiswap',
  //   external: true,
  // },
  {
    name: i18n._(t`Tools`),
    description: i18n._(t`Tools to optimize your workflow.`),
    href: '/tools',
    external: false,
  },
  {
    name: i18n._(t`Discord`),
    description: i18n._(t`Join the community on Discord.`),
    href: 'https://discord.gg/NVPXN4e',
    external: true,
  },
  {
    name: i18n._(t`Vesting`),
    description: i18n._(t`Weekly unlocks from the vesting period.`),
    href: '/vesting',
    external: false,
  },
]

export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)
  const [animationMode, toggleSetAnimationMode] = useAnimationModeManager()
  console.log('animationMode', animationMode)
  return (
    <Popover className="relative ml-auto md:m-0">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-primary' : 'text-secondary',
              'focus:outline-none hover:text-high-emphesis'
            )}
          >
            <svg
              width="16px"
              height="16px"
              className="inline-flex items-center w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="absolute z-50 w-screen max-w-xs px-2 mt-3 transform -translate-x-full bottom-12 lg:top-12 left-full sm:px-0"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 px-5 py-6 bg-dark-900 sm:gap-8 sm:p-8">
                  <div
                    className="flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer"
                    style={{}}
                    onClick={() => window.open('https://lux.partners')}
                  >
                    About
                    <div className="ml-4 sm:ml-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer"
                    style={{}}
                    onClick={() =>
                      window.open('https://etherscan.io')
                    }
                  >
                    Analytics
                    <div className="ml-4 sm:ml-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    </div>
                  </div>

                {/*
                  <div
                    className="flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer"
                    style={{}}
                  >
                    Animation
                    <div className="ml-4 sm:ml-14">
                      <Toggle
                        id="toggle-disable-multihop-button"
                        isActive={animationMode}
                        toggle={() => toggleSetAnimationMode()}
                      />
                    </div>
                  </div>
                  */}

                  <div
                    className="flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer"
                    style={{}}
                    onClick={() => window.open('https://github.com/luxdefi')}
                  >
                    Code
                    <div className="ml-4 sm:ml-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* <div
                    onClick={() => toggleTheme()}
                    className='flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer'
                    style={{}}>
                    Theme
                    <div className='ml-4 sm:ml-14'>
                      {isDark ? <SunIcon fill={isDark ? 'white' : 'text'} width='18px' /> : <MoonIcon fill={isDark ? 'white' : 'textDisabled'} width='18px' />}
                    </div>
                  </div> */}
                  {/* <div
                    onClick={() => logout}
                    className='flex items-center justify-between -m-3 transition duration-150 text-gray-500 ease-in-out rounded-md hover:text-white cursor-pointer'
                    style={{}}>
                    Log Out
                    <div className='ml-4 sm:ml-14'>
                      <RiLogoutCircleLine fill='gray' />
                    </div>
                  </div> */}
                  {/* <div className="relative grid gap-6 px-5 py-6 bg-dark-900 sm:gap-8 sm:p-8">
                  {solutions.map((item) => (
                    <ExternalLink
                      key={item.name}
                      href={item.href}
                      className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800"
                    >
                      <p className="text-base font-medium text-high-emphesis">{item.name}</p>
                      <p className="mt-1 text-sm text-secondary">{item.description}</p>
                    </ExternalLink>
                  ))}
                </div> */}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
