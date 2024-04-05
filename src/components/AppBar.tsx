'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import ConnectWalletToolbar from '@/components/ConnectWalletToolbar'
import LinkTab from '@/components/LinkTab'
import NavTabs from '@/components/NavTabs'
import LogoSvg from '@/images/logo.svg'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import isBeforeDate from '@/utils/isBeforeDate'

export default function AppBar() {
  const { correctConnected } = useCorrectConnected()
  const { data: settledData = [] } = useQuery({
    enabled: correctConnected,
    queryKey: [searchUserOrderUrl, 2],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 2,
      })
    },
  })

  const len = settledData.filter((item) =>
    isBeforeDate(item.deliverDeadline),
  ).length

  return (
    <header
      className={'flex h-[64px] flex-row justify-center bg-[#030303] px-[56px]'}
    >
      <div className={'flex w-full max-w-[1684px] flex-row items-center'}>
        <Link href={'/'} className={'mr-10'}>
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
          <LinkTab href={'/dashboard'}>
            {'Dashboard'}
            {!!len && (
              <span
                className={
                  'absolute h-[18px] translate-x-2 rounded-[10px] bg-[#FF2626] px-2 text-xs'
                }
              >
                {len}
              </span>
            )}
          </LinkTab>
          <LinkTab href={'/points'}>{'Points'}</LinkTab>
        </NavTabs>

        <div className={'ml-auto'}>
          <ConnectWalletToolbar />
        </div>
      </div>
    </header>
  )
}
