import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import WalletBlackSvg from '@/images/wallet-black.svg'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import Button from '@/components/Button'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import DataGrid from '@/app/dashboard/_components/DataGrid/DataGrid'
import type { Column } from '@/app/dashboard/_components/DataGrid/DataGrid'
import type { SearchUserOrderResponse } from '@/api'

export default function CompletedTable() {
  const { correctConnected, completed } = useCorrectConnected()
  const { openConnectModal } = useConnectModal()
  const { data: completedData = [], isPending } = useQuery({
    enabled: correctConnected,
    queryKey: [searchUserOrderUrl, 3],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 3,
      })
    },
  })

  const columns: Column<SearchUserOrderResponse>[] = [
    {
      field: 'projectName',
      headerName: 'TOKEN',
      renderCell: ({ row }) => {
        return (
          <div className={'flex justify-center'}>
            <Image
              src={row.projectAvatarUrl}
              className={'mr-2.5 rounded-full'}
              alt={row.projectName}
              width={'24'}
              height={'24'}
            />
            {row.projectName}
            <sup>{`#${row.projectId}`}</sup>
          </div>
        )
      },
    },
    {
      field: 'amount',
      headerName: 'VALUE (USDB)',
      renderCell: ({ row }) => {
        return row.amount * row.price
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
      <DataGrid<SearchUserOrderResponse>
        columns={columns}
        rows={completedData}
        loading={isPending}
      />
      {!correctConnected && completed && (
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
