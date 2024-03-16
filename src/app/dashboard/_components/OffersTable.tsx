import Image from 'next/image'
import clsx from 'clsx'
import { useState } from 'react'
import USDTSvg from '@/images/USDT.svg'
import { tdClasses, thClasses } from '../classes'
import TablePagination from './TablePagination/TablePagination'

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
  time: '2024/3/17 00:27:53',
  value: 2000 + i,
  amount: 10000 + i,
  type: i % 2 === 0 ? 'buy' : 'sell',
}))

export default function OffersTable() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

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
          <th className={thClasses}>{'ACTION'}</th>
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
            <td className={tdClasses}>
              <button
                type={'button'}
                className={
                  'rounded border border-solid border-[#aaa] px-3 py-[5px] text-xs text-[#aaa]'
                }
              >
                {'Cancel'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className={'bg-[var(--body-background-color)]'}>
        <tr>
          <TablePagination
            toolbarClassName={'ml-auto'}
            count={100}
            colSpan={7}
            onPageChange={handleChangePage}
            page={page}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </tr>
      </tfoot>
    </table>
  )
}
