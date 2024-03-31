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
    <div>
      <Tab.Group>
        <div className={'relative flex py-6 2xl:justify-center'}>
          <Tab.List
            className={
              'flex h-[42px] w-full max-w-[900px] justify-center divide-x divide-[#aaa] rounded border border-solid border-[#aaa] text-sm text-[#7E7E7E]'
            }
          >
            <Tab className={tabClasses}>{'To Be Settled'}</Tab>
            <Tab className={tabClasses}>{'My Offers'}</Tab>
            <Tab className={tabClasses}>{'Deals Completed'}</Tab>
          </Tab.List>

          <div className={'absolute right-0 flex h-[42px]'}>
            <TelegramAlertButton />
          </div>
        </div>

        <div className={'overflow-x-auto 2xl:px-20 3xl:px-36 4xl:px-44'}>
          <Suspense fallback={<span className={'loading loading-dots'} />}>
            <Tab.Panels>
              <Tab.Panel>
                <SettledTable />
              </Tab.Panel>
              <Tab.Panel>
                <OffersTable />
              </Tab.Panel>
              <Tab.Panel>
                <CompletedTable />
              </Tab.Panel>
            </Tab.Panels>
          </Suspense>
        </div>
      </Tab.Group>
    </div>
  )
}
