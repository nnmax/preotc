import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import useCountdown from '@/hooks/useCountdown'
import { tdClasses, thClasses } from '../classes'
import TablePagination from './TablePagination/TablePagination'

export default function SettledTable() {
  const { data: settledData } = useSuspenseQuery({
    queryKey: [searchUserOrderUrl, 2],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 2,
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
          <th className={thClasses}>{'COUNTDOWN'}</th>
          <th className={thClasses}>{'ACTION'}</th>
        </tr>
      </thead>
      <tbody>
        {settledData.map((item) => (
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
              {item.type === 1 ? 'BUY' : 'SELL'}
            </td>
            <Countdown deadline={item.deliverDeadline} />
            <td className={tdClasses}>
              {(item.status === 2 || item.status === 4) && (
                <button
                  type={'button'}
                  className={clsx(
                    'rounded border border-solid border-black px-3 py-[5px] text-xs',
                    {
                      'bg-[#EB2F96]': item.status === 2,
                      'border-none bg-[#3D3D3D] text-[#9B9B9B]':
                        item.status === 4,
                    },
                  )}
                >
                  {'Settle'}
                </button>
              )}
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

function Countdown({ deadline }: { deadline: string | null }) {
  const [countdown, { startCountdown, stopCountdown }] = useCountdown({
    countStart: deadline ? dayjs(deadline).diff(undefined, 'seconds') : 0,
  })

  useEffect(() => {
    startCountdown()

    return () => {
      stopCountdown()
    }
  }, [startCountdown, stopCountdown])

  const hours = Math.floor(countdown / 3600)
  const minutes = Math.floor(countdown / 60) % 60
  const seconds = countdown % 60

  const displayCountdown = `${hours}:${minutes}:${seconds}`

  return <td className={tdClasses}>{deadline ? displayCountdown : ''}</td>
}
