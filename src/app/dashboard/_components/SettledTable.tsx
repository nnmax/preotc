import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import useCountdown from '@/hooks/useCountdown'
import DepositSuccessfulModal from '@/app/dashboard/_components/DepositSuccessfulModal'
import SettleConfirmDialog from '@/app/dashboard/_components/SettleConfirmDialog'
import { SteeldConfirmLocalStorageKey } from '@/constant'
import WalletBlackSvg from '@/images/wallet-black.svg'
import Button from '@/components/Button'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import isBeforeDate from '@/utils/isBeforeDate'
import { tdClasses, thClasses, trBorderClasses } from '../classes'
import DepositModal from './DepositModal'
import type { SearchUserOrderResponse } from '@/api'
// import TablePagination from './TablePagination/TablePagination'

export default function SettledTable() {
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [settledModalOpen, setSettledModalOpen] = useState(false)
  const { correctConnected } = useCorrectConnected()
  const { openConnectModal } = useConnectModal()
  const queryClient = useQueryClient()
  const [depositSuccessfulModalOpen, setDepositSuccessfulModalOpen] =
    useState(false)
  const [currentData, setCurrentData] = useState<SearchUserOrderResponse>()
  const { data: settledData = [] } = useQuery({
    enabled: correctConnected,
    queryKey: [searchUserOrderUrl, 2],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 2,
      })
    },
  })

  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(10)

  // const handleChangePage = (
  //   event: React.MouseEvent<HTMLButtonElement> | null,
  //   newPage: number,
  // ) => {
  //   setPage(newPage)
  // }

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10))
  //   setPage(0)
  // }

  const handleSettled = (current: SearchUserOrderResponse) => {
    setCurrentData(current)
    setDepositModalOpen(true)
  }

  useEffect(() => {
    if (
      settledData &&
      settledData.some((item) => isBeforeDate(item.deliverDeadline))
    ) {
      const settledConfirm = window.localStorage.getItem(
        SteeldConfirmLocalStorageKey,
      )
      if (!settledConfirm) {
        setSettledModalOpen(true)
      }
    }
  }, [settledData])

  return (
    <div>
      <table className={'table'}>
        <thead>
          <tr className={trBorderClasses}>
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
          {settledData.map((item, index, arr) => {
            const beforeDate = isBeforeDate(item.deliverDeadline)
            return (
              <tr
                key={item.id}
                className={
                  index === arr.length - 1
                    ? 'hover'
                    : clsx(trBorderClasses, 'hover')
                }
              >
                <td className={tdClasses}>
                  <div className={'flex'}>
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
                  {(beforeDate === null || beforeDate) && (
                    <button
                      type={'button'}
                      disabled={beforeDate === null}
                      onClick={
                        beforeDate ? () => handleSettled(item) : undefined
                      }
                      className={clsx(
                        'h-[28px] w-[77px] rounded border border-solid border-black px-3 py-[5px] text-xs',
                        {
                          'bg-[#EB2F96]': beforeDate,
                          'border-none bg-[#3D3D3D] text-[#9B9B9B]':
                            beforeDate === null,
                        },
                      )}
                    >
                      {'Settle'}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <DepositModal
          open={depositModalOpen}
          setOpen={setDepositModalOpen}
          currentData={currentData}
          onSuccess={() => {
            setDepositSuccessfulModalOpen(true)
            queryClient.invalidateQueries({
              queryKey: [searchUserOrderUrl, 2],
            })
          }}
        />
        <DepositSuccessfulModal
          open={depositSuccessfulModalOpen}
          setOpen={setDepositSuccessfulModalOpen}
        />
        <SettleConfirmDialog
          open={settledModalOpen}
          setOpen={setSettledModalOpen}
        />
        {/* <tfoot className={'bg-[var(--body-background-color)]'}>
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
      </tfoot> */}
      </table>
      {!correctConnected && (
        <Button
          bgColorClass={'bg-[#FFC300]'}
          className={'mx-auto mt-32 !w-auto px-4 text-xs text-black'}
          onClick={openConnectModal}
        >
          <Image
            src={WalletBlackSvg}
            alt={'next'}
            width={'20'}
            className={'mr-5'}
          />
          {'Connect EVM Wallet'}
        </Button>
      )}
    </div>
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
