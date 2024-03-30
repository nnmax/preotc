'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSuspenseQuery } from '@tanstack/react-query'
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
        <div className={'flex w-full max-w-[60%] gap-x-12'}>
          <Tab.List
            className={
              'flex h-[42px] w-fit rounded border border-solid border-[#aaa] text-center text-sm text-[#9e9e9e]'
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

const tabClasses =
  'flex w-24 items-center justify-center aria-selected:bg-[#FFC300] aria-selected:text-black'

const tabPanelClasses =
  '5xl:grid-cols-6 grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-11 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-10 4xl:grid-cols-5'

function Filter() {
  const { data: projects } = useSuspenseQuery({
    queryKey: [listProjectUrl],
    queryFn: listProject,
  })
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const value = searchParams.get('token')

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
    router.push((pathname + '?' + createQueryString('token', _value)) as any)
  }

  return (
    <div className={'w-full overflow-hidden'}>
      <ToggleButtonGroup
        className={
          'no-scrollbar flex w-full items-center gap-x-2 overflow-x-auto overflow-y-hidden'
        }
        value={value}
        onChange={handleToggleButtonChange}
      >
        {projects.map((project) => (
          <ToggleButton
            key={project.id}
            value={project.id.toString()}
            className={clsx(
              'flex w-fit items-center rounded border border-solid border-[#aaa] px-3 py-2 aria-pressed:bg-[#FFC300] aria-pressed:text-black',
            )}
          >
            <Image
              className={'mr-3 rounded-full'}
              src={project.avatarUrl}
              alt={project.name}
              width={'24'}
              height={'24'}
            />
            <span>{project.name}</span>
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
        className={'mr-8 flex items-center rounded bg-[#EB2F96] px-5'}
        onClick={handleClickLink}
      >
        {'Create Offer'}
      </Link>
      <TelegramAlertButton />
    </div>
  )
}
