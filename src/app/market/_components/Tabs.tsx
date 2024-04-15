'use client'
import { Tab } from '@headlessui/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Suspense, useState } from 'react'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import BuyPanel from './BuyPanel'
import SellPanel from './SellPanel'
import Filter from './Filter'

export default function Tabs() {
  const searchParams = useSearchParams()
  const defaultIndex = searchParams.get('tab') === 'sell' ? 1 : 0
  const [project, setProject] = useState<string | null>(
    searchParams.get('project'),
  )

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <div className={'flex justify-between py-6'}>
        <div className={'flex'}>
          <Tab.List
            className={
              'mr-10 flex h-[36px] w-fit rounded border border-solid border-[#FFC300] text-center text-sm text-[#FFC300]'
            }
          >
            <Tab className={tabClasses} as={Link} href={'/market?tab=buy'}>
              {'Buy'}
            </Tab>
            <Tab className={tabClasses} as={Link} href={'/market?tab=sell'}>
              {'Sell'}
            </Tab>
          </Tab.List>

          <Suspense fallback={<span className={'loading loading-dots'} />}>
            <Filter value={project} setValue={setProject} />
          </Suspense>
        </div>

        <TabsRightActions />
      </div>
      <Tab.Panels>
        <Tab.Panel className={tabPanelClasses}>
          <Suspense fallback={<span className={'loading loading-dots'} />}>
            <BuyPanel project={project} />
          </Suspense>
        </Tab.Panel>
        <Tab.Panel className={tabPanelClasses}>
          <Suspense fallback={<span className={'loading loading-dots'} />}>
            <SellPanel project={project} />
          </Suspense>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const tabClasses =
  'flex w-24 items-center justify-center transition-colors aria-selected:bg-[#FFC300] aria-selected:text-black'

const tabPanelClasses =
  'grid gap-4 min-[1440px]:grid-cols-4 min-[1920px]:grid-cols-5 min-[1104px]:grid-cols-3 min-[768px]:grid-cols-2'

function TabsRightActions() {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  const handleClickLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (!address) {
      event.preventDefault()
      openConnectModal!()
    }
  }

  return (
    <div className={'flex'}>
      <Link
        href={'/create'}
        className={
          'mr-4 flex items-center whitespace-nowrap rounded bg-[#EB2F96] px-5 text-sm'
        }
        onClick={handleClickLink}
      >
        {'Create Offer'}
      </Link>
      <TelegramAlertButton />
    </div>
  )
}
