import Image from 'next/image'
import clsx from 'clsx'
import USDTSvg from '@/images/USDT.svg'
import { tdClasses, thClasses } from '../classes'

interface Data {
  id: number
  token: string
  time: string
  value: number
  amount: number
  type: 'buy' | 'sell'
  countdown: string
}

const data: Data[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  token: 'KKKK',
  time: new Date().toLocaleString(),
  value: 2000 + i,
  amount: 10000 + i,
  type: i % 2 === 0 ? 'buy' : 'sell',
  countdown: '09:35:22',
}))

export default function DeliveredTable() {
  return (
    <table className={'table bg-[#2A3037]'}>
      {/* head */}
      <thead>
        <tr>
          <th className={thClasses}>{'TOKEN'}</th>
          <th className={thClasses}>{'TIME'}</th>
          <th className={thClasses}>{'VALUE'}</th>
          <th className={thClasses}>{'AMOUNT'}</th>
          <th className={thClasses}>{'TYPE'}</th>
          <th className={thClasses}>{'COUNTDOWN'}</th>
          <th className={thClasses}>{'ACTION'}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={item.id} className={'hover'}>
            <td className={tdClasses}>
              <div className={'flex justify-center'}>
                <Image
                  src={USDTSvg}
                  className={'mr-2.5'}
                  alt={'USDT'}
                  width={'24'}
                />
                {item.token}
                <sup>{'#25'}</sup>
              </div>
            </td>
            <td className={tdClasses}>
              <time>{item.time}</time>
            </td>
            <td className={tdClasses}>{item.value.toLocaleString()}</td>
            <td className={tdClasses}>{item.amount.toLocaleString()}</td>
            <td
              className={clsx(
                tdClasses,
                item.type === 'buy' ? 'text-[#FFC300]' : 'text-[#EB2F96]',
              )}
            >
              {item.type.toLocaleUpperCase()}
            </td>
            <td className={tdClasses}>{item.countdown}</td>
            <td className={tdClasses}>
              {[0, 1, 2].includes(i) && (
                <button
                  type={'button'}
                  className={
                    'rounded border border-solid border-black bg-[#EB2F96] px-3 py-[5px] text-xs'
                  }
                >
                  {'Deliver'}
                </button>
              )}
              {[3, 4, 5].includes(i) && (
                <button
                  type={'button'}
                  className={
                    'rounded border border-solid border-black bg-[#FFC300] px-3 py-[5px] text-xs text-black'
                  }
                >
                  {'Check'}
                </button>
              )}
              {[6, 7, 8].includes(i) && (
                <button
                  type={'button'}
                  disabled
                  className={
                    'rounded bg-[#3D3D3D] px-3 py-[5px] text-xs text-[#9B9B9B]'
                  }
                >
                  {'Deliver'}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
