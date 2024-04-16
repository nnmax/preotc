'use client'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import InfoSVG from '@/images/info.svg'
import Telegram from '@/components/Icons/Telegram'
import Tooltip from '@/components/Tooltip'
import { useGenTgLink } from '@/api/mutation'
import { useTgLinkInfo, useUser } from '@/api/query'
import useLoggedIn from '@/hooks/useLoggedIn'

const info =
  'Please connect your telegram to ensure that you can receive timely alerts such as settlement notifications and successful deals!'

export default function TelegramAlertButton({ type }: { type?: 1 | 2 }) {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [code, setCode] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const { loggedIn } = useLoggedIn()
  const { data: user } = useUser({
    query: {
      enabled: Boolean(address) && loggedIn,
    },
  })
  const {
    genTgLinkAsync,
    isPending: fetchingLink,
    data: genTgLinkResponse,
  } = useGenTgLink()

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
          toast.success('You have successfully linked to Telegram', {
            autoClose: false,
          })
          return false
        }
        if (genTgLinkResponse && genTgLinkResponse.indate) {
          if (
            dayjs().isAfter(
              dayjs(genTgLinkResponse.serverTime).add(
                Number(genTgLinkResponse.indate),
                'seconds',
              ),
            )
          ) {
            setIsRefetching(false)
            setCode('')
            toast.dismiss()
            toast.error('The link has expired, please try again', {
              autoClose: false,
            })
            return false
          }
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
          <Telegram className={'text-white'} />
        )}
        <span>{'Set Alert'}</span>
      </button>
    )
  }

  return (
    <>
      <button
        type={'button'}
        className={
          'mr-2.5 flex h-9 w-9 items-center justify-center rounded bg-[#0698D8]'
        }
        onClick={handleClick}
        disabled={fetchingLink || isRefetching}
      >
        {fetchingLink || isRefetching ? (
          <span className={'loading loading-dots'} />
        ) : (
          <Telegram className={'text-white'} />
        )}
      </button>
      <Tooltip
        placement={'bottom-end'}
        title={
          <p>
            <Telegram className={'mr-2 inline text-[#0698D8]'} />
            <span>{info}</span>
          </p>
        }
      >
        <Image
          aria-label={info}
          tabIndex={0}
          src={InfoSVG}
          width={'24'}
          className={'cursor-pointer'}
          alt={''}
        />
      </Tooltip>
    </>
  )
}
