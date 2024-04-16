import Image from 'next/image'
import dayjs from 'dayjs'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Decimal from 'decimal.js'
import WalletBlackSvg from '@/images/wallet-black.svg'
import Button from '@/components/Button'
import DataGrid from '@/app/dashboard/_components/DataGrid/DataGrid'
import type { TableCommonProps } from '@/app/dashboard/types'
import type { Column } from '@/app/dashboard/_components/DataGrid/DataGrid'
import type { UserOrderData } from '@/api/query'

export default function CompletedTable({
  rows,
  completed,
  correctConnected,
  isLoading,
}: TableCommonProps) {
  const { openConnectModal } = useConnectModal()

  const columns: Column<UserOrderData>[] = [
    {
      field: 'projectName',
      headerName: 'TOKEN',
      renderCell: ({ row }) => {
        return (
          <div className={'flex items-center'}>
            <Image
              src={row.projectAvatarUrl}
              className={'mr-2.5 rounded-full'}
              alt={''}
              width={'24'}
              height={'24'}
            />
            {row.projectName}
            <sup>{`#${row.id}`}</sup>
          </div>
        )
      },
    },
    {
      field: 'amount',
      headerName: 'VALUE (USDB)',
      renderCell: ({ row }) => {
        return new Decimal(row.amount || 0).mul(row.price || 0).toNumber()
      },
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
    },
    {
      field: 'type',
      headerName: 'TYPE',
      renderCell: ({ row }) => (
        <span className={row.type === 1 ? 'text-[#FFC300]' : 'text-[#EB2F96]'}>
          {row.type === 1 ? 'BUY' : 'SELL'}
        </span>
      ),
    },
    {
      field: 'completeTime',
      headerName: 'FINISH TIME',
      renderCell: ({ row }) => {
        return (
          <time>
            {row.completeTime
              ? dayjs(row.completeTime).format('MM/DD HH:mm:ss')
              : 'Invalid Date'}
          </time>
        )
      },
    },
  ]

  return (
    <div>
      <DataGrid<UserOrderData>
        columns={columns}
        rows={rows}
        loading={isLoading}
      />
      {!correctConnected && completed && (
        <Button
          bgColorClass={'bg-[#FFC300]'}
          className={'mx-auto mt-32 !w-auto px-4 text-xs text-black'}
          onClick={openConnectModal}
        >
          <Image
            src={WalletBlackSvg}
            alt={''}
            width={'20'}
            className={'mr-5'}
          />
          {'Connect EVM Wallet'}
        </Button>
      )}
    </div>
  )
}
