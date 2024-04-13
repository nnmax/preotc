'use client'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ToggleButtonGroup from '@/components/ToggleButtonGroup'
import ToggleButton from '@/components/ToggleButton'
import { useProjects } from '@/api/query'
import ArrowDown from '@/components/Icons/ArrowDown'

const threshold = 5

export default function Filter(props: {
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

  const limitProjects = projects.slice(0, threshold)

  return (
    <ToggleButtonGroup
      value={value}
      onChange={handleToggleButtonChange}
      className={'flex items-center gap-x-[6px]'}
    >
      {limitProjects.map((project) => (
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

      {projects.length > threshold && (
        <Popover className={'relative'}>
          {() => {
            return (
              <>
                <Popover.Button
                  className={clsx(
                    toggleButtonClasses,
                    '!bg-[#F8B62D] text-black',
                  )}
                >
                  {'More'}
                  <ArrowDown className={'ml-1'} />
                </Popover.Button>

                <Popover.Overlay
                  className={'fixed inset-0 z-10 bg-black opacity-60'}
                />

                <Popover.Panel
                  className={
                    'absolute right-0 z-10 w-max max-w-[600px] translate-y-2 justify-start rounded-[10px] bg-[#2A3037] p-6'
                  }
                >
                  <div className={'flex flex-wrap gap-x-2 gap-y-4'}>
                    {projects.map((project) => (
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
              </>
            )
          }}
        </Popover>
      )}
    </ToggleButtonGroup>
  )
}

const toggleButtonClasses =
  'flex h-[36px] w-fit items-center rounded border border-solid border-aaa/50 px-2 text-xs aria-pressed:border-[#FFC300] aria-pressed:text-[#F8B62D]'
