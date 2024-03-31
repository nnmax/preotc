import Image from 'next/image'
import clsx from 'clsx'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import { tdClasses, thClasses } from '../classes'
import TablePagination from './TablePagination/TablePagination'

export default function OffersTable() {
  const { data: offers } = useSuspenseQuery({
    queryKey: [searchUserOrderUrl, 1],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 1,
      })
    },
  })
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
          <th className={thClasses}>{'VALUE (USDB)'}</th>
          <th className={thClasses}>{'AMOUNT'}</th>
          <th className={thClasses}>{'TYPE'}</th>
          <th className={thClasses}>{'ACTION'}</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((item) => (
          <tr key={item.id} className={'hover'}>
            <td className={tdClasses}>
              <div className={'flex justify-center'}>
                <Image
                  src={item.projectAvatarUrl}
                  className={'mr-2.5 rounded-full'}
                  alt={item.projectName}
                  width={'24'}
                  height={'24'}
                />
                {item.projectName}
                <sup>{`#${item.projectId}`}</sup>
              </div>
            </td>
            <td className={tdClasses}>
              <time>
                {item.createTime
                  ? dayjs(item.createTime).format('MM/DD HH:mm:ss')
                  : 'Invalid Date'}
              </time>
            </td>
            <td className={tdClasses}>{item.amount * item.price}</td>
            <td className={tdClasses}>{item.amount}</td>
            <td
              className={clsx(
                tdClasses,
                item.type === 1 ? 'text-[#FFC300]' : 'text-[#EB2F96]',
              )}
            >
              {item.type === 1 ? 'Buy' : 'Sell'}
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
