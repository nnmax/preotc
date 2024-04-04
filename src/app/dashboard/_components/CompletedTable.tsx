import Image from 'next/image'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useConnections } from 'wagmi'
import WalletBlackSvg from '@/images/wallet-black.svg'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import Button from '@/components/Button'
import { tdClasses, thClasses, trBorderClasses } from '../classes'
import type { WalletType } from '@/types'
// import TablePagination from './TablePagination/TablePagination'

export default function CompletedTable() {
  const { address } = useAccount()
  const [correctConnected, setCorrectConnected] = useState(false)
  const { openConnectModal } = useConnectModal()
  const connections = useConnections()
  const { data: completedData = [] } = useQuery({
    queryKey: [searchUserOrderUrl, 3],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 3,
      })
    },
  })

  useEffect(() => {
    if (!address || !connections.length) return
    const walletName = connections[0].connector.name.toLowerCase() as WalletType
    if (walletName === 'BTC') return
    setCorrectConnected(true)
  }, [connections, address])

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

  return (
    <div>
      <table className={'table'}>
        <thead>
          <tr className={trBorderClasses}>
            <th className={thClasses}>{'TOKEN'}</th>
            <th className={thClasses}>{'VALUE (USDB)'}</th>
            <th className={thClasses}>{'AMOUNT'}</th>
            <th className={thClasses}>{'TYPE'}</th>
            <th className={thClasses}>{'FINISH TIME'}</th>
          </tr>
        </thead>
        <tbody>
          {completedData.map((item, index, arr) => (
            <tr
              key={item.id}
              className={
                index === arr.length - 1
                  ? 'hover'
                  : clsx(trBorderClasses, 'hover')
              }
            >
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
                <time>
                  {item.completeTime
                    ? dayjs(item.completeTime).format('MM/DD HH:mm:ss')
                    : 'Invalid Date'}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
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
