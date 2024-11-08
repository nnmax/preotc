import Image from 'next/image'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import USDBSvg from '@/images/USDB.svg'
import RightSVG from '@/images/right.svg'
import LinkButton from '@/app/market/_components/LinkButton'
import type { MarketOrderData } from '@/api/query'

dayjs.extend(relativeTime)

const cardClasses =
  'flex w-full relative flex-col rounded-[10px] border-t-[6px] border-solid border-[#3B4043] bg-[#2A3037] p-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)]'

const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' })

export default function Card(props: { data: MarketOrderData }) {
  const { data } = props

  return (
    <div className={cardClasses}>
      <div className={'flex gap-2'}>
        <Image
          src={data.projectAvatarUrl}
          alt={data.projectName}
          width={'32'}
          height={'32'}
          className={'rounded-full'}
        />
        <div className={'flex flex-col gap-1 leading-4'}>
          <span>{data.projectName}</span>
          <span
            className={'text-xs text-[rgba(155,155,155,0.6)]'}
          >{`#${data.id}`}</span>
        </div>
      </div>
      <div
        className={
          'flex items-start justify-between border-b border-solid border-aaa/30 pb-4 pt-4 text-sm'
        }
      >
        <div className={'flex flex-col'}>
          <span className={'mb-4 text-xs text-[rgba(155,155,155,0.6)]'}>
            {'Offer'}
          </span>
          <span className={'mb-4 flex items-center leading-[14px]'}>
            {`${data.amount} ${data.pluralUnit}`}
          </span>
          <span className={'text-xs leading-3 text-white'}>
            {`$ ${data.price} / ${data.singularUnit}`}
          </span>
        </div>
        <div
          className={
            'absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2'
          }
        >
          <Image src={RightSVG} alt={'right'} width={'24'} />
        </div>
        <div className={'flex flex-col items-end'}>
          <span className={'mb-4 text-[rgba(155,155,155,0.6)]'}>{'For'}</span>
          <span
            className={'flex items-center text-[#FFC300]'}
            title={(data.amount * data.price).toString()}
          >
            {numberFormatter.format(
              new Decimal(data.amount || 0).mul(data.price || 0).toNumber(),
            )}
            <Image src={USDBSvg} alt={'USDB'} width={'14'} className={'ml-1'} />
          </span>
        </div>
      </div>

      <div className={'flex items-center justify-between pt-2'}>
        <span
          className={'text-xs text-[rgba(155,155,155,0.6)]'}
          suppressHydrationWarning
          title={
            data.createTime
              ? dayjs(data.createTime).toDate().toLocaleString()
              : undefined
          }
        >
          {data.createTime ? dayjs(data.createTime).fromNow() : 'Invalid Date'}
        </span>
        <LinkButton data={data} />
      </div>
    </div>
  )
}
