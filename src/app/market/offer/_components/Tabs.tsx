'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import XSvg from '@/images/x.svg'
import Panel from './Panel'
import type { ListProjectResponse } from '@/api'

function tabClasses({ selected }: { selected: boolean }) {
  return clsx(
    'flex flex-1 items-center justify-center',
    selected && 'bg-[#FFC300] text-black',
  )
}

export default function Tabs() {
  const searchParams = useSearchParams()
  const selectedProject = searchParams.has('selectedProject')
    ? (JSON.parse(searchParams.get('selectedProject')!) as ListProjectResponse)
    : null
  const defaultIndex = searchParams.get('tab') === 'selling' ? 1 : 0

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List
        className={clsx(
          'flex h-[42px] max-w-[640px] rounded border border-solid border-[#FFC300] text-center text-[18px] text-[#FFC300]',
          !!selectedProject && 'hidden',
        )}
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

      {!!selectedProject && (
        <div className={'flex items-center'}>
          <Image
            src={selectedProject.avatarUrl}
            alt={''}
            width={'60'}
            height={'60'}
            className={'mr-5 rounded-full'}
          />
          <div className={'flex flex-col'}>
            <p className={'mb-3 text-[18px] leading-5'}>
              {selectedProject.name}
            </p>
            <a
              href={selectedProject.twitterUrl}
              target={'_blank'}
              rel={'noreferrer'}
              className={
                'flex w-5 items-center rounded-[3px] border border-solid border-[#737373] p-[2px]'
              }
            >
              <Image src={XSvg} alt={'x'} width={'16'} height={'16'} />
            </a>
          </div>
        </div>
      )}

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
