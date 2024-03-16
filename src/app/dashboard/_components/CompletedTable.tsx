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
}

const data: Data[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  token: 'KKKK',
  time: new Date().toLocaleString(),
  value: 2000 + i,
  amount: 10000 + i,
  type: i % 2 === 0 ? 'buy' : 'sell',
}))

export default function CompletedTable() {
  return (
    <table className={'table bg-[#2A3037]'}>
      {/* head */}
      <thead>
        <tr>
          <th className={thClasses}>{'TOKEN'}</th>
          <th className={thClasses}>{'VALUE'}</th>
          <th className={thClasses}>{'AMOUNT'}</th>
          <th className={thClasses}>{'TYPE'}</th>
          <th className={thClasses}>{'FINISH TIME'}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
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
            <td className={tdClasses}>
              <time>{item.time}</time>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
