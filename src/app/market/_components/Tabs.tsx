'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import OneSVG from '@/images/1.svg'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import BuyPanel from '@/app/market/_components/BuyPanel'
import SellPanel from '@/app/market/_components/SellPanel'

export default function Tabs() {
  const searchParams = useSearchParams()
  const defaultIndex = searchParams.get('tab') === 'sell' ? 1 : 0

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <div className={'flex justify-between py-6'}>
        <div className={'flex gap-x-12'}>
          <Tab.List
            className={
              'flex h-[42px] rounded border border-solid border-[#aaa] text-center text-sm text-[#9e9e9e]'
            }
          >
            <Tab className={tabClasses} as={Link} href={'/market?tab=buy'}>
              {'Buy'}
            </Tab>
            <Tab className={tabClasses} as={Link} href={'/market?tab=sell'}>
              {'Sell'}
            </Tab>
          </Tab.List>

          <Filter />
        </div>

        <TabsRightActions />
      </div>
      <Tab.Panels>
        <Tab.Panel className={tabPanelClasses}>
          <BuyPanel />
        </Tab.Panel>
        <Tab.Panel className={tabPanelClasses}>
          <SellPanel />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

function tabClasses({ selected }: { selected: boolean }) {
  return clsx(
    'flex w-24 items-center justify-center',
    selected && 'bg-[#FFC300] text-black',
  )
}

const tabPanelClasses =
  '5xl:grid-cols-6 grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-11 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-10 4xl:grid-cols-5'

function Filter() {
  return (
    <div className={'flex gap-x-2'}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={
            'flex rounded border border-solid border-[#aaa] px-3 py-2 text-center'
          }
        >
          <Image className={'mr-3'} src={OneSVG} alt={''} width={'24'} />
          <span>{'KKK'}</span>
        </div>
      ))}
    </div>
  )
}

function TabsRightActions() {
  return (
    <div className={'flex'}>
      <Link
        href={'/market/offer'}
        className={'mr-8 flex items-center rounded bg-[#EB2F96] px-5'}
      >
        {'Create Offer'}
      </Link>
      <TelegramAlertButton />
    </div>
  )
}
