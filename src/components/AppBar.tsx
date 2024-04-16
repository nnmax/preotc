'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ConnectWalletToolbar from '@/components/ConnectWalletToolbar'
import LinkTab from '@/components/LinkTab'
import NavTabs from '@/components/NavTabs'
import LogoSvg from '@/images/logo.svg'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import getSettledStatus from '@/utils/getSettledStatus'
import { useUserOrder } from '@/api/query'
import SettleConfirmDialog from '@/components/SettleConfirmDialog'
import { SettledOrderIdsStorageKey } from '@/constant'

export default function AppBar() {
  const { correctConnected } = useCorrectConnected()
  const [settledModalOpen, setSettledModalOpen] = useState(false)
  const { data: settledData = [] } = useUserOrder({
    dashboardType: 2,
    query: { enabled: correctConnected },
  })

  const len = settledData.filter((item) =>
    getSettledStatus(item.deliverDeadline, item.type),
  ).length

  useEffect(() => {
    const settledIds = (settledData ?? [])
      .filter((item) => getSettledStatus(item.deliverDeadline, item.type))
      .map((row) => row.id)
    if (settledIds.length <= 0) return

    const settledIdsFromStorageRaw = window.localStorage.getItem(
      SettledOrderIdsStorageKey,
    )
    let settledIdsFromStorage: number[] = []

    try {
      settledIdsFromStorage = settledIdsFromStorageRaw
        ? JSON.parse(settledIdsFromStorageRaw)
        : []
    } catch (error) {
      settledIdsFromStorage = []
    }

    const count = settledIds.filter(
      (item) => !settledIdsFromStorage.includes(item),
    ).length

    if (count > 0) {
      setSettledModalOpen(true)
      window.localStorage.setItem(
        SettledOrderIdsStorageKey,
        JSON.stringify(settledIds),
      )
    }
  }, [settledData])

  return (
    <header
      className={'flex h-[64px] flex-row justify-center bg-[#030303] px-[56px]'}
    >
      <SettleConfirmDialog
        open={settledModalOpen}
        setOpen={setSettledModalOpen}
      />

      <div className={'flex w-full max-w-[1684px] flex-row items-center'}>
        <Link href={'/'} className={'mr-10'}>
          <h1 className={'sr-only'}>{'PREOTC'}</h1>
          <Image
            src={LogoSvg}
            alt={''}
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
                  'ml-1 inline-block h-[18px] rounded-[10px] bg-[#FF2626] px-2 text-xs'
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
