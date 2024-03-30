import clsx from 'clsx'
import Image from 'next/image'
import USDBSvg from '@/images/USDB.svg'
import { stepPanelClasses } from '@/constant'

interface SecondStepPanelProps {
  type: 'buy' | 'sell'
  amount: number
  pricePerToken: number
  price: number
  fee: number
}

export default function SecondStepPanel(props: SecondStepPanelProps) {
  const { type, amount, pricePerToken, price, fee } = props
  const labelText = type === 'buy' ? 'Buying' : 'Selling'
  const labelBg = type === 'buy' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'

  return (
    <div
      className={clsx(stepPanelClasses, 'mb-[52px] mt-[22px] flex flex-col')}
    >
      <span
        className={clsx(
          labelBg,
          'self-start rounded-[3px] px-2.5 leading-6 text-black',
        )}
      >
        {labelText}
      </span>
      <span className={'mb-11 mt-8'}>{amount}</span>
      <span
        className={clsx(
          labelBg,
          'self-start rounded-[3px] px-2.5 leading-6 text-black',
        )}
      >
        {'Price Per Token'}
      </span>
      <p className={'my-8 flex items-center justify-between'}>
        <span>{pricePerToken}</span>
        <span className={'flex text-[#9E9E9E]'}>
          {'USDB '}
          <Image src={USDBSvg} alt={'USDB'} className={'ml-2.5'} />
        </span>
      </p>
      <span className={'mb-3 text-[#737373]'}>{'For'}</span>
      <span className={'text-[#FFC300]'}>{`$ ${price.toLocaleString()}`}</span>
      <p className={'mt-8 flex items-center justify-between'}>
        <span className={'text-[#737373]'}>{'PreOTC fee'}</span>
        <span>{`${fee}%`}</span>
      </p>
    </div>
  )
}
