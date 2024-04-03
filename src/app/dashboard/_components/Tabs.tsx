'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Suspense } from 'react'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import SettledTable from './SettledTable'
import OffersTable from './OffersTable'
import CompletedTable from './CompletedTable'

function tabClasses({ selected }: { selected: boolean }) {
  return clsx('flex-1', selected && 'bg-[#FFC300] text-black')
}

export default function Tabs() {
  return (
    <div className={'flex flex-col items-center'}>
      <Tab.Group>
        <div className={'flex w-full justify-between py-4 pt-6'}>
          <div className={'flex flex-1 justify-center'}>
            <Tab.List
              className={
                'flex h-[36px] w-full max-w-[720px] justify-center divide-x divide-[#aaa] rounded border border-solid border-[#aaa] text-sm text-[#7E7E7E]'
              }
            >
              <Tab className={tabClasses}>{'To Be Settled'}</Tab>
              <Tab className={tabClasses}>{'My Offers'}</Tab>
              <Tab className={tabClasses}>{'Deals Completed'}</Tab>
            </Tab.List>
          </div>

          <div className={'ml-2 flex h-[36px] w-fit'}>
            <TelegramAlertButton />
          </div>
        </div>

        <div className={'w-full max-w-[1200px] overflow-x-auto'}>
          <Tab.Panels>
            <Tab.Panel>
              <Suspense fallback={<span className={'loading loading-dots'} />}>
                <SettledTable />
              </Suspense>
            </Tab.Panel>
            <Tab.Panel>
              <Suspense fallback={<span className={'loading loading-dots'} />}>
                <OffersTable />
              </Suspense>
            </Tab.Panel>
            <Tab.Panel>
              <Suspense fallback={<span className={'loading loading-dots'} />}>
                <CompletedTable />
              </Suspense>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  )
}
