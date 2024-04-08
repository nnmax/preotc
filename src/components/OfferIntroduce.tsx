'use client'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import TelegramAlertButton from '@/components/TelegramAlertButton'
import {
  fetchGetCurrentLoginUser,
  getCurrentLoginUser,
} from '@/api/get-current-login-user'
import { LoggedInLocalStorageKey } from '@/constant'

export default function OfferIntroduce({ className }: { className?: string }) {
  const address = useAccount().address
  const { data: userInfo } = useQuery({
    enabled:
      Boolean(address) &&
      Boolean(window.localStorage.getItem(LoggedInLocalStorageKey)),
    queryKey: [getCurrentLoginUser],
    queryFn: () => {
      return fetchGetCurrentLoginUser()
    },
  })

  return (
    <div
      className={clsx(
        className,
        'flex w-full max-w-[565px] flex-col gap-5 text-xs leading-[30px] text-white [&>p>a]:text-[#FFC300] [&>p>a]:underline [&>p>span]:text-[#FFC300]',
      )}
    >
      <p>
        {
          '1. In order to ensure that the seller will complete the settlement in time, The seller needs to deposit '
        }
        <span>{'twice'}</span> {'the deal amount of USDB.'}
      </p>
      <p>
        {
          '2. Please pay close attention to the settlement time, once the settlement process is started, the seller will have '
        }
        <span>{'72 hours'}</span>
        {
          " to settle the tokens, if it is not completed before the deadline, it will be regarded as a breach of contract, and the seller's deposit will be regarded as the compensation for the buyer!"
        }
      </p>
      <p>
        {'3. '}
        <span>{'How to get USDB?'}</span>
        {' Bridge USDT/ USDC/ DAI to the Blast Network on '}
        <a href={'https://blast.io'} target={'_blank'} rel={'noreferrer'}>
          {'blast.io'}
        </a>
        {'.'}
      </p>
      {!userInfo || userInfo.tgStatus ? null : (
        <p>
          {
            '4. Please connect your telegram to ensure that you can receive timely alerts such as settlement notifications, confirmation notifications and deals completion!'
          }
        </p>
      )}
      <TelegramAlertButton type={2} />
    </div>
  )
}
