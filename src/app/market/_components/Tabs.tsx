'use client'
import { Popover, Tab, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Suspense, useState } from 'react'
// import TelegramAlertButton from '@/components/TelegramAlertButton'
import ToggleButtonGroup from '@/components/ToggleButtonGroup'
import ToggleButton from '@/components/ToggleButton'
import { useProjects } from '@/api/query'
import BuyPanel from './BuyPanel'
import SellPanel from './SellPanel'

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

const toggleButtonClasses =
  'flex h-[36px] w-fit items-center rounded border border-solid border-aaa/50 px-2 text-xs aria-pressed:border-[#FFC300] aria-pressed:text-[#F8B62D]'

const MORE_KEY = 'more'

function Filter(props: {
  value: string | null
  setValue: (value: string | null) => void
}) {
  const { setValue, value } = props
  const { data: projects } = useProjects()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

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
    setValue(_value)
    router.push((pathname + '?' + createQueryString('project', _value)) as any)
  }

  const showProjects = projects.slice(0, 5)
  const hiddenProjects = projects.slice(5)

  return (
    <ToggleButtonGroup
      value={value}
      onChange={handleToggleButtonChange}
      className={'flex items-center gap-x-[6px]'}
    >
      {showProjects.map((project) => (
        <ToggleButton
          key={project.id}
          value={project.id.toString()}
          className={toggleButtonClasses}
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

      {hiddenProjects.length > 0 && (
        <Popover className={'relative'}>
          {() => {
            return (
              <>
                <Popover.Button
                  className={clsx(
                    toggleButtonClasses,
                    '!border-[#FFC300] !text-[#F8B62D]',
                  )}
                >
                  {'More'}
                </Popover.Button>

                <Transition
                  enter={'transition duration-100 ease-out'}
                  enterFrom={'opacity-0'}
                  enterTo={'opacity-100'}
                  leave={'transition duration-75 ease-out'}
                  leaveFrom={'scale-100 opacity-100'}
                  leaveTo={'scale-95 opacity-0'}
                >
                  <Popover.Overlay
                    className={'fixed inset-0 z-10 bg-black opacity-60'}
                  />
                </Transition>

                <Transition
                  enter={'transition duration-100 ease-out'}
                  enterFrom={'transform scale-95 opacity-0'}
                  enterTo={'transform scale-100 opacity-100'}
                  leave={'transition duration-75 ease-out'}
                  leaveFrom={'transform scale-100 opacity-100'}
                  leaveTo={'transform scale-95 opacity-0'}
                >
                  <Popover.Panel
                    className={
                      'absolute right-0 z-10 translate-y-2 justify-start rounded-[10px] bg-[#2A3037] p-6'
                    }
                  >
                    <div className={'flex gap-x-2 gap-y-4'}>
                      {hiddenProjects.map((project) => (
                        <ToggleButton
                          key={project.id}
                          value={project.id.toString()}
                          className={toggleButtonClasses}
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
                          <span className={'whitespace-nowrap'}>
                            {project.name}
                          </span>
                        </ToggleButton>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )
          }}
        </Popover>
      )}
    </ToggleButtonGroup>
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
        className={
          'mr-4 flex items-center whitespace-nowrap rounded bg-[#EB2F96] px-5 text-sm'
        }
        onClick={handleClickLink}
      >
        {'Create Offer'}
      </Link>
      {/* <TelegramAlertButton /> */}
    </div>
  )
}
