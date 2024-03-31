'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import BuyPanel from '@/app/market/_components/BuyPanel'
import SellPanel from '@/app/market/_components/SellPanel'
import { listProject, listProjectUrl } from '@/api'
import ToggleButtonGroup from '@/components/ToggleButtonGroup'
import ToggleButton from '@/components/ToggleButton'

export default function Tabs() {
  const searchParams = useSearchParams()
  const defaultIndex = searchParams.get('tab') === 'sell' ? 1 : 0

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <div className={'flex justify-between py-6'}>
        <div className={'flex w-full max-w-[70%]'}>
          <Tab.List
            className={
              'mr-10 flex h-[36px] w-fit rounded border border-solid border-[#aaa] text-center text-sm text-[#9e9e9e]'
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
            <Filter />
          </Suspense>
        </div>

        <TabsRightActions />
      </div>
      <Suspense fallback={<span className={'loading loading-dots'} />}>
        <Tab.Panels>
          <Tab.Panel className={tabPanelClasses}>
            <BuyPanel />
          </Tab.Panel>
          <Tab.Panel className={tabPanelClasses}>
            <SellPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Suspense>
    </Tab.Group>
  )
}

const tabClasses =
  'flex w-24 items-center justify-center aria-selected:bg-[#FFC300] aria-selected:text-black'

const tabPanelClasses =
  'grid gap-4 grid-cols-[repeat(auto-fill,minmax(324px,1fr))]'

function Filter() {
  const { data: projects } = useSuspenseQuery({
    queryKey: [listProjectUrl],
    queryFn: listProject,
  })
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const value = searchParams.get('project')

  const createQueryString = (name: string, _value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (_value === null) {
      params.delete(name)
    } else {
      params.set(name, _value)
    }
    return params.toString()
  }

  const handleToggleButtonChange = (_value: string | null) => {
    router.push((pathname + '?' + createQueryString('project', _value)) as any)
  }

  return (
    <div className={'w-full overflow-hidden'}>
      <ToggleButtonGroup
        className={
          'no-scrollbar flex w-full items-center gap-x-[6px] overflow-x-auto overflow-y-hidden'
        }
        value={value}
        onChange={handleToggleButtonChange}
      >
        {projects.map((project) => (
          <ToggleButton
            key={project.id}
            value={project.id.toString()}
            className={clsx(
              'flex h-[36px] w-fit items-center rounded border border-solid border-[#aaa] px-2 text-xs aria-pressed:bg-[#FFC300] aria-pressed:text-black',
            )}
          >
            <div className={'mr-2 h-5 w-5'}>
              <Image
                className={'rounded-full'}
                src={project.avatarUrl}
                alt={project.name}
                width={'20'}
                height={'20'}
              />
            </div>
            <span className={'whitespace-nowrap'}>{project.name}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  )
}

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
        className={'mr-4 flex items-center rounded bg-[#EB2F96] px-5 text-sm'}
        onClick={handleClickLink}
      >
        {'Create Offer'}
      </Link>
      <TelegramAlertButton />
    </div>
  )
}
