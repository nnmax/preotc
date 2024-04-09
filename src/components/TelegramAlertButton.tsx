'use client'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TelegramSVG from '@/images/telegram.svg'
import InfoSVG from '@/images/info.svg'
import TelegramSvg from '@/images/telegram.svg'
import Tooltip from '@/components/Tooltip'
import { useGenTgLink } from '@/api/mutation'
import { useTgLinkInfo, useUser } from '@/api/query'
import { LoggedInLocalStorageKey } from '@/constant'

const info =
  'Please connect your telegram to ensure that you can receive timely alerts such as settlement notifications and successful deals!'

export default function TelegramAlertButton({ type }: { type?: 1 | 2 }) {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [code, setCode] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const { data: user } = useUser({
    query: {
      enabled:
        Boolean(address) &&
        Boolean(window.localStorage.getItem(LoggedInLocalStorageKey)),
    },
  })
  const { genTgLinkAsync, isPending: fetchingLink } = useGenTgLink()

  // useQuery 返回的 isRefetching 不满足要求
  const [isRefetching, setIsRefetching] = useState(false)
  useTgLinkInfo({
    invitaitonCode: code,
    query: {
      enabled: Boolean(code),
      refetchInterval(query) {
        if (query.state.data === 0) {
          setIsRefetching(false)
          setConnected(true)
          setCode('')
          toast.success('You have successfully linked to Telegram')
          return false
        }
        return 1000
      },
    },
  })

  const handleClick = async () => {
    if (!address) {
      openConnectModal!()
      return
    }

    const response = await genTgLinkAsync()

    if (response?.invitationLink) {
      setIsRefetching(true)
      // cSpell:disable-next-line
      setCode(response.invitaitonCode)
      window.open(response.invitationLink)
    }
  }

  if (!user || user?.tgStatus || connected) return null

  if (type === 2) {
    return (
      <button
        type={'button'}
        className={
          'flex h-9 w-[154px] items-center justify-center gap-3 rounded-[5px] bg-[#0698D8] text-sm'
        }
        onClick={handleClick}
        disabled={fetchingLink || isRefetching}
      >
        {fetchingLink || isRefetching ? (
          <span className={'loading loading-dots'} />
        ) : (
          <Image src={TelegramSvg} alt={'telegram'} width={'23'} />
        )}
        <span>{'Connect'}</span>
      </button>
    )
  }

  return (
    <>
      <button
        type={'button'}
        className={'mr-2.5 flex items-center gap-3 rounded bg-[#0698D8] px-5'}
        onClick={handleClick}
        disabled={fetchingLink || isRefetching}
      >
        {fetchingLink || isRefetching ? (
          <span className={'loading loading-dots'} />
        ) : (
          <Image src={TelegramSVG} width={'24'} alt={'telegram'} />
        )}
        <span className={'whitespace-nowrap'}>{'Set Alert'}</span>
      </button>
      <Tooltip placement={'bottom-end'} title={info}>
        <Image
          aria-label={info}
          tabIndex={0}
          src={InfoSVG}
          width={'24'}
          className={'cursor-pointer'}
          alt={'info'}
        />
      </Tooltip>
    </>
  )
}
