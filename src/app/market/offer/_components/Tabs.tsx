'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Panel from './Panel'

function tabClasses({ selected }: { selected: boolean }) {
  return clsx(
    'flex flex-1 items-center justify-center',
    selected && 'bg-[#FFC300] text-black',
  )
}

export default function Tabs() {
  const searchParams = useSearchParams()
  const defaultIndex = searchParams.get('tab') === 'selling' ? 1 : 0

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List
        className={
          'flex h-[42px] max-w-[640px] rounded border border-solid border-[#FFC300] text-center text-[18px] text-[#FFC300]'
        }
      >
        <Tab className={tabClasses} as={Link} href={'/market/offer?tab=buying'}>
          {'Buying'}
        </Tab>
        <Tab
          className={tabClasses}
          as={Link}
          href={'/market/offer?tab=selling'}
        >
          {'Selling'}
        </Tab>
      </Tab.List>

      <Tab.Panels>
        <Tab.Panel>
          <Panel tab={'buying'} />
        </Tab.Panel>
        <Tab.Panel>
          <Panel tab={'selling'} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}
