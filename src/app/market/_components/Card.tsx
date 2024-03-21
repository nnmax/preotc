import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import USDTSvg from '@/images/USDT.svg'
import OneSVG from '@/images/1.svg'
import RightSVG from '@/images/right.svg'
import type { SearchMarketOrderResponse } from '@/api'

export default function Card(props: {
  type: 'buy' | 'sell'
  data: SearchMarketOrderResponse
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, data } = props
  return (
    <div
      className={
        'flex w-full flex-col rounded-[10px] border-t-[6px] border-solid border-[#3B4043] bg-[#2A3037] px-4 pb-2.5 pt-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)]'
      }
    >
      <div className={'flex gap-x-[6px]'}>
        <div className={'top-0 h-10 w-10 rounded-full bg-[#D8D8D8]'} />
        <div className={'flex flex-col'}>
          <span className={''}>{'KKK'}</span>
          <span className={'text-xs'}>{'#345'}</span>
        </div>
      </div>
      <div
        className={
          'flex items-start justify-between border-b border-solid border-[rgba(155,155,155,0.6)] pb-4 pt-4 text-sm'
        }
      >
        <div className={'flex flex-col'}>
          <span className={'text-[rgba(155,155,155,0.6) mb-1'}>{'Offer'}</span>
          <span className={'mb-2 flex items-center'}>
            {'7050 K'}
            <Image src={OneSVG} alt={''} width={'12'} className={'ml-1'} />
          </span>
          <span className={'text-[rgba(155,155,155,0.6) text-xs'}>
            {'$ 0.1516 / Token'}
          </span>
        </div>
        <Image
          src={RightSVG}
          alt={'right'}
          width={'24'}
          className={'ml-2 mr-auto mt-3.5'}
        />
        <div className={'flex flex-col items-end'}>
          <span className={'text-[rgba(155,155,155,0.6) mb-1'}>{'For'}</span>
          <span className={'flex items-center text-[#FFC300]'}>
            {'3050K'}
            <Image src={USDTSvg} alt={'USDT'} width={'14'} className={'ml-1'} />
          </span>
        </div>
      </div>

      <div className={'flex items-center justify-between pt-2.5'}>
        <span className={'text-xs'}>{'7 Days Ago'}</span>
        <Link
          href={type === 'sell' ? '/market/offer/sell' : '/market/offer/buy'}
          className={clsx(
            'flex h-7 items-center rounded px-5 text-sm',
            type === 'buy' ? 'bg-[#004DFF]' : 'bg-[#EB2F96]',
          )}
        >
          {type === 'buy' ? 'BUY' : 'SELL'}
        </Link>
      </div>
    </div>
  )
}
