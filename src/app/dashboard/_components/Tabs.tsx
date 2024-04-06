'use client'
import { Tab } from '@headlessui/react'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import SettledTable from './SettledTable'
import OffersTable from './OffersTable'
import CompletedTable from './CompletedTable'
import type { Route } from 'next'

const tabClasses =
  'flex-1 aria-selected:bg-[#FFC300] aria-selected:text-black transition-colors'

type TabIndex = 0 | 1 | 2

export default function Tabs() {
  const { correctConnected, completed } = useCorrectConnected()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [tabIndex, setTabIndex] = useState<TabIndex>(
    Number(searchParams.get('tab') ?? 0) as TabIndex,
  )
  const dashboardType = tabIndex === 0 ? 2 : tabIndex === 1 ? 1 : 3
  const { data, isPending } = useQuery({
    enabled: correctConnected,
    queryKey: [searchUserOrderUrl, dashboardType],
    queryFn: () => {
      return searchUserOrder({
        dashboardType,
      })
    },
  })

  return (
    <div className={'flex flex-col items-center'}>
      <Tab.Group
        defaultIndex={tabIndex}
        onChange={(selectedIndex): void => {
          setTabIndex(selectedIndex as TabIndex)
          router.push((pathname + `?tab=${selectedIndex}`) as Route)
        }}
      >
        <div className={'relative flex w-full justify-center py-4 pt-6'}>
          <Tab.List
            className={
              'flex h-[36px] w-full max-w-[720px] justify-center divide-x divide-[#FFC300] rounded border border-solid border-[#FFC300] text-sm text-[#FFC300]'
            }
          >
            <Tab className={tabClasses}>{'To Be Settled'}</Tab>
            <Tab className={tabClasses}>{'My Offers'}</Tab>
            <Tab className={tabClasses}>{'Deals Completed'}</Tab>
          </Tab.List>

          <div className={'absolute right-0 flex h-[36px] w-fit'}>
            <TelegramAlertButton />
          </div>
        </div>

        <div className={'w-full max-w-[1260px] overflow-x-auto'}>
          <Tab.Panels>
            <Tab.Panel>
              <SettledTable
                rows={data}
                isPending={isPending}
                correctConnected={correctConnected}
                completed={completed}
              />
            </Tab.Panel>
            <Tab.Panel>
              <OffersTable
                rows={data}
                isPending={isPending}
                correctConnected={correctConnected}
                completed={completed}
              />
            </Tab.Panel>
            <Tab.Panel>
              <CompletedTable
                rows={data}
                isPending={isPending}
                correctConnected={correctConnected}
                completed={completed}
              />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  )
}
