'use client'
import { Tab } from '@headlessui/react'
import { Suspense } from 'react'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import SettledTable from './SettledTable'
import OffersTable from './OffersTable'
import CompletedTable from './CompletedTable'

const tabClasses =
  'flex-1 aria-selected:bg-[#FFC300] aria-selected:text-black transition-colors'

export default function Tabs() {
  return (
    <div className={'flex flex-col items-center'}>
      <Tab.Group>
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
