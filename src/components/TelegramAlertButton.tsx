import clsx from 'clsx'
import { Popover } from '@headlessui/react'
import Image from 'next/image'
import TelegramSVG from '@/images/telegram.svg'
import InfoSVG from '@/images/info.svg'

const info =
  'Please connect your telegram to ensure that you can receive timely alerts such as delivery notifications and successful deals!'

export default function TelegramAlertButton() {
  return (
    <>
      {' '}
      <button
        type={'button'}
        className={'mr-2.5 flex items-center rounded bg-[#0698D8] px-5'}
      >
        <Image
          src={TelegramSVG}
          width={'24'}
          className={'mr-3'}
          alt={'telegram'}
        />
        <span>{'Set Alert'}</span>
      </button>
      <Popover className={'relative flex items-center'}>
        <Popover.Button>
          <Image
            aria-label={info}
            tabIndex={0}
            src={InfoSVG}
            width={'24'}
            alt={'info'}
          />
        </Popover.Button>
        <Popover.Panel
          className={clsx`
      absolute
      right-0
      top-full
      w-[460px]
      translate-y-2
      rounded-md
      border
      border-solid
      border-[#aaa]
      bg-[#1e1e1e]
      text-xs
      leading-6
    `}
        >
          <p>
            {'Please connect your telegram to ensure that you can receive'}
            {'timely alerts such as delivery notifications and successful'}
            {'deals!'}
          </p>
        </Popover.Panel>
      </Popover>
    </>
  )
}
