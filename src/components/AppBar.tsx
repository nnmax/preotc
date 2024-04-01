'use client'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import Link from 'next/link'
import ConnectWalletToolbar from '@/components/ConnectWalletToolbar'
import LinkTab from '@/components/LinkTab'
import NavTabs from '@/components/NavTabs'
import LogoSvg from '@/images/logo.svg'

export default function AppBar() {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  return (
    <header
      className={'flex h-[72px] flex-row justify-center bg-[#030303] px-[60px]'}
    >
      <div className={'flex w-full max-w-[1684px] flex-row items-center'}>
        <Link href={'/'} className={'mr-14'}>
          <h1 className={'sr-only'}>{'PREOTC'}</h1>
          <Image
            src={LogoSvg}
            alt={'logo'}
            width={132}
            height={24}
            className={'max-w-[132px]'}
          />
        </Link>

        <NavTabs>
          <LinkTab href={'/market'}>{'Market'}</LinkTab>
          <LinkTab
            href={'/dashboard'}
            onClick={(e) => {
              if (!address) {
                e.preventDefault()
                openConnectModal!()
              }
            }}
          >
            {'Dashboard'}
          </LinkTab>
        </NavTabs>

        <div className={'ml-auto'}>
          <ConnectWalletToolbar />
        </div>
      </div>
    </header>
  )
}
