'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import OneSVG from '@/images/1.svg'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import Card from './Card'

const gridData = Array.from({ length: 20 }, (_, i) => i)

export default function Tabs() {
  return (
    <Tab.Group>
      <div className={'flex justify-between py-6'}>
        <div className={'flex gap-x-12'}>
          <Tab.List
            className={
              'flex h-[42px] rounded border border-solid border-[#aaa] text-center text-sm text-[#9e9e9e]'
            }
          >
            <Tab className={tabClasses}>{'Buy'}</Tab>
            <Tab className={tabClasses}>{'Sell'}</Tab>
          </Tab.List>

          <Filter />
        </div>

        <TabsRightActions />
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <div className={tabPanelClasses}>
            {gridData.map((item) => (
              <Card key={item} type={'buy'} />
            ))}
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className={tabPanelClasses}>
            {gridData.map((item) => (
              <Card key={item} type={'sell'} />
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

function tabClasses({ selected }: { selected: boolean }) {
  return clsx('w-24', selected && 'bg-[#FFC300] text-black')
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
      <button type={'button'} className={'mr-8 rounded bg-[#EB2F96] px-5'}>
        {'Create Offer'}
      </button>
      <TelegramAlertButton />
    </div>
  )
}
