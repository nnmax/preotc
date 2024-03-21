'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import clsx from 'clsx'
import { forwardRef, useEffect } from 'react'
import { useSignMessage, useAccount, useConfig } from 'wagmi'
import { useMutation } from '@tanstack/react-query'
import { verifyMessage } from 'wagmi/actions'
import WalletSvg from '@/images/wallet.svg'
import EthDarkSvg from '@/images/eth-dark.svg'
import ArrowDownSvg from '@/images/arrow-down.svg'
import USDTSvg from '@/images/USDT.svg'
import { fetchConnectWalletUrl, ConnectWalletUrl } from '@/api'
import { MessageLocalStorageKey, SignatureLocalStorageKey } from '@/constant'
import type { Hex } from 'viem'
import type { ConnectWalletParams } from '@/api'
// import { Popover, Transition } from '@headlessui/react'
// import LogoutSvg from '@/images/logout.svg'

export default function ConnectWalletToolbar() {
  useSign()

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, openAccountModal, account }) => {
        if (account) {
          return (
            <div className={'flex'}>
              <Box className={'mr-5 w-40 justify-start text-xs'}>
                <Image
                  src={USDTSvg}
                  width={'18'}
                  alt={'USDT'}
                  className={'mr-1'}
                />
                <span title={account.balanceFormatted}>
                  {account.balanceFormatted}
                </span>
              </Box>
              <Box button onClick={openAccountModal}>
                <Image
                  src={EthDarkSvg}
                  alt={'eth'}
                  width={'18'}
                  height={'18'}
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
                  className={'-mb-1 ml-1'}
                />
              </Box>
              {/* TODO: 询问蔡叔, 下面这种方式无法实现 */}
              {/* <Popover className={'relative'}>
                {({ close }) => {
                  return (
                    <>
                      <Popover.Button as={Box} button>
                        <Image
                          src={EthDarkSvg}
                          alt={'eth'}
                          width={'18'}
                          height={'18'}
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
                          className={'-mb-1 ml-1'}
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
                          as={Box}
                          className={
                            'absolute w-full translate-y-1 justify-start bg-[#030303] px-3 py-2 text-xs shadow-md'
                          }
                        >
                          <button
                            type={'button'}
                            className={'button-base'}
                            onClick={() => {
                              openAccountModal()
                              close()
                            }}
                          >
                            <Image
                              src={LogoutSvg}
                              alt={'logout'}
                              width={'18'}
                              className={'mr-2'}
                            />
                            <span>{'Disconnect'}</span>
                          </button>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )
                }}
              </Popover> */}
            </div>
          )
        }

        return (
          <Box onClick={openConnectModal} button>
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
        chainId: 1,
      })
      const signature = await signMessageAsync({
        message: res!.message,
        account: address,
      })
      window.localStorage.setItem(SignatureLocalStorageKey, signature)
      window.localStorage.setItem(MessageLocalStorageKey, res!.message)
      mutateAsync({
        address,
        chainId: 1,
        signature,
        message: res!.message,
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
        'button-base flex h-8 items-center rounded border border-solid border-[#aaa] px-2.5 py-1 text-sm text-white',
      )}
    >
      {children}
    </Component>
  )
})
