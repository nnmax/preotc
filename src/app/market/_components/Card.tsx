import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import USDTSvg from '@/images/USDT.svg'
import OneSVG from '@/images/1.svg'
import RightSVG from '@/images/right.svg'
import type { SearchMarketOrderResponse } from '@/api'

dayjs.extend(relativeTime)

const cardClasses =
  'flex w-full flex-col rounded-[10px] border-t-[6px] border-solid border-[#3B4043] bg-[#2A3037] px-4 pb-2.5 pt-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)]'

const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' })

export default function Card(props: {
  type: 'buy' | 'sell'
  data: SearchMarketOrderResponse
}) {
  const { type, data } = props

  return (
    <div className={cardClasses}>
      <div className={'flex gap-x-[6px]'}>
        <Image
          src={data.projectAvatarUrl}
          alt={data.projectName}
          width={'40'}
          height={'40'}
          className={'rounded-full'}
        />
        <div className={'flex flex-col'}>
          <span className={''}>{data.projectName}</span>
          <span className={'text-xs'}>{`#${data.projectId}`}</span>
        </div>
      </div>
      <div
        className={
          'flex items-start justify-between border-b border-solid border-[rgba(155,155,155,0.6)] pb-4 pt-4 text-sm'
        }
      >
        <div className={'flex flex-col'}>
          <span className={'mb-1 text-[rgba(155,155,155,0.6)]'}>{'Offer'}</span>
          <span
            className={'mb-2 flex items-center'}
            title={data.amount.toString()}
          >
            {numberFormatter.format(data.amount)}
            <Image src={OneSVG} alt={''} width={'12'} className={'ml-1'} />
          </span>
          <span
            className={'text-xs text-[rgba(155,155,155,0.6)]'}
            title={data.price.toString()}
          >
            {`$ ${data.price.toLocaleString()} / Token`}
          </span>
        </div>
        <Image
          src={RightSVG}
          alt={'right'}
          width={'24'}
          className={'ml-2 mr-auto mt-3.5'}
        />
        <div className={'flex flex-col items-end'}>
          <span className={'mb-1 text-[rgba(155,155,155,0.6)]'}>{'For'}</span>
          <span
            className={'flex items-center text-[#FFC300]'}
            title={(data.amount * data.price).toString()}
          >
            {numberFormatter.format(data.amount * data.price)}
            <Image src={USDTSvg} alt={'USDT'} width={'14'} className={'ml-1'} />
          </span>
        </div>
      </div>

      <div className={'flex items-center justify-between pt-2.5'}>
        <span
          className={'text-xs text-[rgba(155,155,155,0.6)]'}
          title={
            data.createTime
              ? dayjs(data.createTime).toDate().toLocaleString()
              : undefined
          }
        >
          {data.createTime ? dayjs(data.createTime).fromNow() : 'Invalid Date'}
        </span>
        <Link
          href={
            type === 'sell'
              ? '/offer/address?type=sell'
              : '/offer/address?type=buy'
          }
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
