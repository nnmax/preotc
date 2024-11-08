import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Decimal from 'decimal.js'
import useCountdown from '@/hooks/useCountdown'
import DepositSuccessfulModal from '@/app/dashboard/_components/DepositSuccessfulModal'
import WalletBlackSvg from '@/images/wallet-black.svg'
import Button from '@/components/Button'
import DataGrid from '@/app/dashboard/_components/DataGrid/DataGrid'
import getSettledStatus from '@/utils/getSettledStatus'
import { userOrderKey, type UserOrderData } from '@/api/query'
import DepositModal from './DepositModal'
import type { TableCommonProps } from '@/app/dashboard/types'
import type { Column } from '@/app/dashboard/_components/DataGrid/DataGrid'

export default function SettledTable({
  rows,
  completed,
  correctConnected,
  isLoading,
}: TableCommonProps) {
  const [depositModalOpen, setDepositModalOpen] = useState(false)

  const { openConnectModal } = useConnectModal()
  const queryClient = useQueryClient()
  const [depositSuccessfulModalOpen, setDepositSuccessfulModalOpen] =
    useState(false)
  const [currentData, setCurrentData] = useState<UserOrderData>()

  const handleSettled = (current: UserOrderData) => {
    setCurrentData(current)
    setDepositModalOpen(true)
  }

  const columns: Column<UserOrderData>[] = [
    {
      field: 'projectName',
      headerName: 'TOKEN',
      renderCell: ({ row }) => (
        <div className={'flex items-center'}>
          <Image
            src={row.projectAvatarUrl}
            className={'mr-2.5 rounded-full'}
            alt={row.projectName}
            width={'24'}
            height={'24'}
          />
          {row.projectName}
          <sup>{`#${row.id}`}</sup>
        </div>
      ),
    },
    {
      field: 'createTime',
      headerName: 'TIME',
      renderCell: ({ row }) => {
        return (
          <time>
            {row.createTime
              ? dayjs(row.createTime).format('MM/DD HH:mm:ss')
              : ''}
          </time>
        )
      },
    },
    {
      field: 'amount',
      headerName: 'VALUE (USDB)',
      renderCell: ({ row }) =>
        new Decimal(row.amount || 0).mul(row.price || 0).toNumber(),
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
      field: 'deliverDeadline',
      headerName: 'COUNTDOWN',
      renderCell: ({ row }) => <Countdown deadline={row.deliverDeadline} />,
    },
    {
      field: 'action',
      headerName: 'ACTION',
      renderCell: ({ row }) => {
        const settledStatus = getSettledStatus(row.deliverDeadline, row.type)
        return (
          settledStatus !== null && (
            <button
              type={'button'}
              disabled={!settledStatus}
              onClick={settledStatus ? () => handleSettled(row) : undefined}
              className={clsx(
                'h-[28px] w-[77px] rounded border border-solid border-black px-3 py-[5px] text-xs',
                {
                  'bg-[#EB2F96]': settledStatus,
                  'border-none bg-[#3D3D3D] text-[#9B9B9B]': !settledStatus,
                },
              )}
            >
              {'Settle'}
            </button>
          )
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
      <DepositModal
        open={depositModalOpen}
        setOpen={setDepositModalOpen}
        currentData={currentData}
        onSuccess={() => {
          setDepositSuccessfulModalOpen(true)
          queryClient.invalidateQueries({
            queryKey: userOrderKey({
              dashboardType: 2,
            }),
          })
        }}
      />
      <DepositSuccessfulModal
        open={depositSuccessfulModalOpen}
        setOpen={setDepositSuccessfulModalOpen}
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

  return deadline ? displayCountdown : ''
}
