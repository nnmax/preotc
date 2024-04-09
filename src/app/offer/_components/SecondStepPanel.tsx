import clsx from 'clsx'
import Image from 'next/image'
import USDBSvg from '@/images/USDB.svg'
import { stepPanelClasses } from '@/constant'
import InfoSVG from '@/images/info.svg'
import Tooltip from '@/components/Tooltip'

interface SecondStepPanelProps {
  type: 'buy' | 'sell'
  amount: number
  pricePerToken: number
  price: number
  fee: number
}

const info =
  'This 2.5% service fee is based on the value of the deal, not on the value of the deposit.'

export default function SecondStepPanel(props: SecondStepPanelProps) {
  const { type, amount, pricePerToken, price, fee } = props
  const labelText = type === 'buy' ? 'Buying' : 'Selling'
  const labelClasses = clsx('self-start rounded-[3px] px-2 text-sm leading-6', {
    'bg-[#FFC300] text-black': type === 'buy',
    'bg-[#EB2F96] text-white': type === 'sell',
  })

  return (
    <div className={clsx(stepPanelClasses, 'flex flex-col')}>
      <span className={labelClasses}>{labelText}</span>
      <span className={'mb-6 mt-4 text-sm leading-[14px]'}>{amount}</span>
      <span className={labelClasses}>{'Price Per Token'}</span>
      <p className={'mb-6 mt-4 flex items-center justify-between text-sm'}>
        <span>{pricePerToken}</span>
        <span className={'flex text-[#9E9E9E]'}>
          {'USDB '}
          <Image src={USDBSvg} alt={'USDB'} className={'ml-2.5'} />
        </span>
      </p>
      <span className={'mb-4 text-[#737373]'}>{'For'}</span>
      <span
        className={'text-sm leading-[14px] text-[#FFC300]'}
      >{`$ ${price.toLocaleString()}`}</span>
      <p className={'mt-8 flex items-center justify-between leading-4'}>
        <span className={'text-[#737373]'}>{'PreOTC fee'}</span>
        <span className={'ml-auto mr-2'}>{`${fee * 100}%`}</span>
        {type === 'sell' && (
          <Tooltip placement={'top-end'} title={info}>
            <Image
              aria-label={info}
              tabIndex={0}
              src={InfoSVG}
              width={'24'}
              className={'cursor-pointer'}
              alt={'info'}
            />
          </Tooltip>
        )}
      </p>
    </div>
  )
}
