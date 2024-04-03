'use client'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TelegramSVG from '@/images/telegram.svg'
import InfoSVG from '@/images/info.svg'
import TelegramSvg from '@/images/telegram.svg'
import {
  fetchGenerateTelegramInvitationLink,
  fetchGetTelegramInvitationInfo,
  generateTelegramInvitationLinkUrl,
  getTelegramInvitationInfoUrl,
} from '@/api'
import {
  fetchGetCurrentLoginUser,
  getCurrentLoginUser,
} from '@/api/get-current-login-user'
import Tooltip from '@/components/Tooltip'

const info =
  'Please connect your telegram to ensure that you can receive timely alerts such as delivery notifications and successful deals!'

export default function TelegramAlertButton({ type }: { type?: 1 | 2 }) {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [code, setCode] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const { data: userInfo } = useQuery({
    enabled: Boolean(address),
    queryKey: [getCurrentLoginUser],
    queryFn: () => {
      return fetchGetCurrentLoginUser()
    },
  })
  const { mutateAsync: fetchLink, isPending: fetchingLink } = useMutation({
    mutationKey: [generateTelegramInvitationLinkUrl],
    mutationFn: () => {
      return fetchGenerateTelegramInvitationLink()
    },
  })

  // useQuery 返回的 isRefetching 不满足要求
  const [isRefetching, setIsRefetching] = useState(false)
  useQuery({
    gcTime: 0,
    enabled: Boolean(code),
    queryKey: [getTelegramInvitationInfoUrl, code],
    queryFn: () => {
      return fetchGetTelegramInvitationInfo(code)
    },
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
  })

  const handleClick = async () => {
    if (!address) {
      openConnectModal!()
      return
    }

    const response = await fetchLink()

    if (response?.invitationLink) {
      setIsRefetching(true)
      // cSpell:disable-next-line
      setCode(response.invitaitonCode)
      window.open(response.invitationLink)
    }
  }

  if (!userInfo || userInfo?.tgStatus || connected) {
    return null
  }

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
