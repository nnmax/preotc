'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import {
  useSignMessage,
  useAccount,
  useConfig,
  useAccountEffect,
  useConnections,
  useChainId,
  useDisconnect,
} from 'wagmi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { verifyMessage } from 'wagmi/actions'
import { Popover, Transition } from '@headlessui/react'
import WalletSvg from '@/images/wallet.svg'
import EthIcon from '@/images/eth-24x24.png'
import EthYellowIcon from '@/images/eth-yellow.png'
import USDBSvg from '@/images/USDB.svg'
import ArrowDownSvg from '@/images/arrow-down.svg'
import {
  fetchConnectWalletUrl,
  ConnectWalletUrl,
  getUsdbBalanceUrl,
  getUsdbBalance,
} from '@/api'
import {
  ActiveWalletLocalStorageKey,
  MessageLocalStorageKey,
  RecentWalletsLocalStorageKey,
  SignatureLocalStorageKey,
} from '@/constant'
import logout from '@/utils/logout'
import LogoutSvg from '@/images/logout.svg'
import BTCSvg from '@/images/btc.svg'
import SOLSvg from '@/images/sol.svg'
import ConnectSvg from '@/images/connect-different-wallet.svg'
import BlastIcon from '@/images/blast-icon.svg'
import isBlastChain from '@/utils/isBlastChain'
import type { WalletType } from '@/types'
import type { SetStateAction } from 'react'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import type { Hex } from 'viem'
import type { ConnectWalletParams } from '@/api'

function getWalletChainType(walletName: string): WalletType {
  if (walletName.indexOf('phantom') !== -1) return 'SOL'
  if (walletName.indexOf('okx') !== -1) return 'BTC'
  return 'ETH'
}

function getIcon(options: {
  walletType: WalletType | undefined
  blastChain?: boolean
  isEthBalance?: boolean
}): {
  src: string | StaticImport
  alt: string
} {
  const { walletType, blastChain, isEthBalance } = options

  if (blastChain) {
    if (isEthBalance) {
      return {
        src: EthYellowIcon,
        alt: 'ETH',
      }
    }

    return {
      src: BlastIcon,
      alt: 'Blast',
    }
  }
  if (walletType === 'SOL') {
    return {
      src: SOLSvg,
      alt: 'SOL',
    }
  }
  if (walletType === 'BTC') {
    return {
      src: BTCSvg,
      alt: 'BTC',
    }
  }
  return {
    src: EthIcon,
    alt: 'ETH',
  }
}

interface WalletRaw {
  name: string
  address: string
  type: WalletType
}

function useRecentWallets(options: { walletType: WalletType | undefined }) {
  const { walletType } = options
  const [recentWalletState, _setRecentWalletState] = useState<WalletRaw[]>([])

  const setRecentWalletState = useCallback(
    (setStateAction: SetStateAction<WalletRaw[]>) => {
      if (typeof setStateAction === 'function') {
        _setRecentWalletState((prev) => {
          const ret = setStateAction(prev)
          window.localStorage.setItem(
            RecentWalletsLocalStorageKey,
            JSON.stringify(ret),
          )
          return ret
        })
      } else {
        _setRecentWalletState(setStateAction)
        window.localStorage.setItem(
          RecentWalletsLocalStorageKey,
          JSON.stringify(setStateAction),
        )
      }
    },
    [],
  )

  useEffect(() => {
    try {
      let recentWallets: WalletRaw[] = JSON.parse(
        window.localStorage.getItem(RecentWalletsLocalStorageKey) ?? '[]',
      )
      if (!Array.isArray(recentWallets)) recentWallets = []
      _setRecentWalletState(
        recentWallets.filter((item) => item.type !== walletType),
      )
    } catch (error) {
      console.error(error)
    }
  }, [walletType])

  return {
    recentWalletState,
    setRecentWalletState,
  }
}

export default function ConnectWalletToolbar() {
  useSign()
  const [walletType, setWalletType] = useState<WalletType>()
  const connections = useConnections()
  const { address } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { recentWalletState, setRecentWalletState } = useRecentWallets({
    walletType,
  })
  const { data: usdbBalance } = useQuery({
    enabled: Boolean(address) && isBlastChain(chainId),
    queryKey: [getUsdbBalanceUrl, address],
    queryFn: () => {
      if (!address) throw new Error('address is required')
      return getUsdbBalance({ address })
    },
  })

  useEffect(() => {
    if (connections.length === 0) return
    const walletName = connections[0].connector.name.toLowerCase()
    const _walletType = getWalletChainType(walletName)
    setWalletType(_walletType)

    const activeRaw = window.localStorage.getItem(ActiveWalletLocalStorageKey)
    if (activeRaw) {
      try {
        let recentWallets: WalletRaw[] = JSON.parse(
          window.localStorage.getItem(RecentWalletsLocalStorageKey) ?? '[]',
        )
        if (!Array.isArray(recentWallets)) recentWallets = []
        const foundIndex = recentWallets.findIndex(
          (item) => item.type === _walletType,
        )
        if (foundIndex === -1) {
          recentWallets.push({
            name: walletName,
            address: connections[0].accounts[0],
            type: _walletType,
          })
        } else {
          recentWallets[foundIndex] = {
            name: walletName,
            address: connections[0].accounts[0],
            type: _walletType,
          }
        }

        window.localStorage.setItem(
          RecentWalletsLocalStorageKey,
          JSON.stringify(recentWallets),
        )
      } catch (error) {
        console.error(error)
      }
    }

    window.localStorage.setItem(
      ActiveWalletLocalStorageKey,
      JSON.stringify({
        name: walletName,
        address: connections[0].accounts[0],
        type: _walletType,
      }),
    )
  }, [connections])

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, account, openChainModal, chain }) => {
        if (account) {
          return (
            <div className={'flex gap-2.5'}>
              {/* <Box className={'min-w-[176px] justify-end text-sm'}>
                <span title={'0'}>{'0'}</span>
                <span className={'ml-2.5 text-[#FFC300]'}>{'PTS'}</span>
              </Box> */}
              {isBlastChain(chainId) && usdbBalance && (
                <Box className={'min-w-[136px] justify-start text-xs'}>
                  <Image
                    src={USDBSvg}
                    alt={'USDB'}
                    width={'20'}
                    height={'20'}
                    className={'mr-2'}
                  />
                  <span title={usdbBalance.usdbBalance.toString()}>
                    {usdbBalance.usdbBalance.toLocaleString()}
                  </span>
                </Box>
              )}
              <Box className={'min-w-[136px] justify-start text-xs'}>
                <Image
                  src={
                    getIcon({
                      walletType,
                      blastChain: isBlastChain(chainId),
                      isEthBalance: true,
                    }).src
                  }
                  alt={
                    getIcon({
                      walletType,
                      blastChain: isBlastChain(chainId),
                      isEthBalance: true,
                    }).alt
                  }
                  width={'20'}
                  height={'20'}
                  className={'mr-2'}
                />
                <span title={account.balanceFormatted}>
                  {account.displayBalance}
                </span>
              </Box>
              {walletType === 'ETH' && (
                <Box button onClick={openChainModal}>
                  {chain?.hasIcon && (
                    <div
                      className={clsx('mr-2.5 h-5 w-5 rounded-full')}
                      style={{
                        background: chain.iconBackground,
                      }}
                    >
                      <div
                        className={
                          'h-full w-full select-none bg-no-repeat transition-opacity'
                        }
                        style={{
                          backgroundImage: chain.iconUrl
                            ? `url(${chain.iconUrl})`
                            : undefined,
                        }}
                      />
                    </div>
                  )}
                  <span className={'whitespace-nowrap'}>
                    {chain?.name || 'Select Chain'}
                  </span>
                  <Image
                    src={ArrowDownSvg}
                    alt={'arrow-down'}
                    height={'18'}
                    className={'-mb-1 ml-2.5'}
                  />
                </Box>
              )}
              <Popover className={'relative'}>
                {({ close }) => {
                  return (
                    <>
                      <Popover.Button as={Box} button>
                        <Image
                          src={
                            getIcon({
                              walletType,
                              blastChain: isBlastChain(chainId),
                            }).src
                          }
                          alt={
                            getIcon({
                              walletType,
                              blastChain: isBlastChain(chainId),
                            }).alt
                          }
                          width={'24'}
                          height={'24'}
                          className={'mr-2'}
                        />
                        <span title={account.address} className={'text-xs'}>
                          {account.address.slice(0, 8)}
                          {'...'}
                          {account.address.slice(-8)}
                        </span>
                        <Image
                          src={ArrowDownSvg}
                          alt={'arrow-down'}
                          height={'18'}
                          className={'-mb-1 ml-2.5'}
                        />
                      </Popover.Button>

                      <Transition
                        enter={'transition duration-100 ease-out'}
                        enterFrom={'transform scale-95 opacity-0'}
                        enterTo={'transform scale-100 opacity-100'}
                        leave={'transition duration-75 ease-out'}
                        leaveFrom={'transform scale-100 opacity-100'}
                        leaveTo={'transform scale-95 opacity-0'}
                      >
                        <Popover.Panel
                          className={
                            'shadow-[0px_4px_10px_0px rgba(0,0,0,0.3)] absolute right-0 z-10 w-[368px] translate-y-1 justify-start rounded-[5px] border border-solid border-aaa/50 bg-[#2A3037] px-4 text-xs'
                          }
                        >
                          <ul
                            className={'flex flex-col divide-y divide-aaa/50'}
                          >
                            <PanelItem
                              connected
                              balance={account.displayBalance}
                              address={account.address}
                              {...(walletType === 'ETH'
                                ? {
                                    icon: EthIcon,
                                    title: 'ETH',
                                  }
                                : walletType === 'BTC'
                                  ? {
                                      icon: BTCSvg,
                                      title: 'BTC',
                                    }
                                  : {
                                      icon: SOLSvg,
                                      title: 'SOL',
                                    })}
                            />

                            {recentWalletState.map((item, index) => (
                              <PanelItem
                                key={index}
                                address={item.address}
                                icon={getIcon({ walletType }).src}
                                title={item.type}
                                onUnlink={() => {
                                  setRecentWalletState((prev) =>
                                    prev.filter(
                                      (_item) => _item.type !== item.type,
                                    ),
                                  )
                                }}
                              />
                            ))}

                            <PanelItem
                              icon={ConnectSvg}
                              button
                              onClick={() => {
                                disconnect()
                                close()
                              }}
                            >
                              <p className={'text-[#FFC300]'}>
                                {'Connect Different Wallet'}
                              </p>
                            </PanelItem>

                            <PanelItem
                              icon={LogoutSvg}
                              button
                              onClick={() => {
                                disconnect()
                                close()
                              }}
                            >
                              <p className={'text-[#A5A5A5]'}>{'Disconnect'}</p>
                            </PanelItem>
                          </ul>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )
                }}
              </Popover>
            </div>
          )
        }

        return (
          <Box onClick={openConnectModal} button className={'w-[222px]'}>
            <Image
              src={WalletSvg}
              alt={'wallet'}
              width={'24'}
              height={'24'}
              className={'mr-2'}
            />
            <span>{'Connect Wallet'}</span>
          </Box>
        )
      }}
    </ConnectButton.Custom>
  )
}

function useSign() {
  const { address } = useAccount()
  const { mutateAsync } = useMutation({
    mutationKey: [ConnectWalletUrl],
    mutationFn: (params: ConnectWalletParams) => {
      return fetchConnectWalletUrl(params)
    },
  })
  const { signMessageAsync } = useSignMessage()
  const config = useConfig()

  useAccountEffect({
    onDisconnect() {
      logout()
    },
  })

  useEffect(() => {
    const _signature = window.localStorage.getItem(SignatureLocalStorageKey)
    const _message = window.localStorage.getItem(MessageLocalStorageKey)

    if (!address) return

    const run = async () => {
      if (_signature && _message) {
        const verified = await verifyMessage(config, {
          address,
          chainId: 1,
          signature: _signature as Hex,
          message: _message as Hex,
        })

        if (verified) return
      }

      const res = await mutateAsync({
        address,
      })
      const message = typeof res === 'string' ? res : ''
      const signature = await signMessageAsync({
        message,
        account: address,
      })
      window.localStorage.setItem(SignatureLocalStorageKey, signature)
      window.localStorage.setItem(MessageLocalStorageKey, message)
      mutateAsync({
        address,
        signature,
        message,
      })
    }

    run()
  }, [address, config, mutateAsync, signMessageAsync])
}

const Box = forwardRef<
  any,
  {
    button?: boolean
    className?: string
    children: React.ReactNode
    onClick?: () => void
  }
>(function Box(props, ref) {
  const { className, children, button, onClick, ...restProps } = props

  const Component = button ? 'button' : 'div'

  return (
    <Component
      {...(button
        ? {
            type: 'button',
            onClick,
          }
        : {})}
      {...restProps}
      ref={ref}
      className={clsx(
        className,
        button && 'button-base',
        'flex h-[36px] items-center rounded border border-solid border-aaa/50 px-2.5 py-1 text-sm text-white',
      )}
    >
      {children}
    </Component>
  )
})

function PanelItem(props: {
  icon: string | StaticImport
  title?: 'ETH' | 'BTC' | 'SOL'
  balance?: string
  address?: string
  children?: React.ReactNode
  connected?: boolean
  onClick?: () => void
  onUnlink?: () => void
  button?: boolean
}) {
  const {
    icon,
    address,
    balance,
    children,
    title,
    connected,
    onClick,
    button,
    onUnlink,
  } = props

  const show = !!title && !!address

  const Component = button ? 'button' : 'div'

  return (
    <li className={'flex-1'}>
      <Component
        type={button ? 'button' : undefined}
        onClick={onClick}
        className={'flex min-h-20 w-full items-center py-4'}
      >
        <Image src={icon} alt={''} className={'mr-2'} />
        {show ? (
          <div className={'flex-1 text-xs'}>
            <p className={'flex items-center justify-between'}>
              <span>
                <span className={'text-sm'}>{title}</span>
                {connected && (
                  <span className={'ml-2 text-[#FFC300]'}>{'Connected'}</span>
                )}
              </span>
              {connected ? (
                <span>
                  {balance} {title}
                </span>
              ) : title === 'ETH' ? null : (
                <button
                  type={'button'}
                  onClick={onUnlink}
                  className={
                    'h-5 w-14 rounded-sm border border-solid border-white'
                  }
                >
                  {'Unlink'}
                </button>
              )}
            </p>
            <p className={'mt-[5px] text-start text-[#A5A5A5]'}>
              {address.slice(0, 6)}
              {'...'}
              {address.slice(-4)}
            </p>
          </div>
        ) : (
          children
        )}
      </Component>
    </li>
  )
}
