import Image from 'next/image'
import dayjs from 'dayjs'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'react-toastify'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { searchUserOrderUrl } from '@/api'
import { cancelOrder, cancelOrderUrl } from '@/api/cancel-order'
import WalletBlackSvg from '@/images/wallet-black.svg'
import Button from '@/components/Button'
import DataGrid from '@/app/dashboard/_components/DataGrid/DataGrid'
import {
  submitCancelOrder,
  submitCancelOrderUrl,
} from '@/api/submit-cancel-order'
import type { TableCommonProps } from '@/app/dashboard/types'
import type { Column } from '@/app/dashboard/_components/DataGrid/DataGrid'
import type { SearchUserOrderResponse } from '@/api'

export default function OffersTable({
  rows,
  completed,
  correctConnected,
  isLoading,
}: TableCommonProps) {
  const { openConnectModal } = useConnectModal()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)
  const { mutateAsync: cancelOrderAsync } = useMutation({
    mutationKey: [cancelOrderUrl],
    mutationFn: cancelOrder,
  })
  const { mutateAsync: submitCancelOrderAsync } = useMutation({
    mutationKey: [submitCancelOrderUrl],
    mutationFn: submitCancelOrder,
  })
  const { sendTransactionAsync } = useSendTransaction()

  const handleCancel = async (orderId: number) => {
    try {
      setSubmitting(true)
      const { cancelOrderCallData } = await cancelOrderAsync({
        orderId,
      })

      const txHash = await sendTransactionAsync({
        to: cancelOrderCallData.destination,
        data: cancelOrderCallData.callData,
        value: parseEther(cancelOrderCallData.value.toString()),
        gas: process.env.NEXT_PUBLIC_IS_DEV === 'true' ? null : undefined,
      }).catch((error) => {
        console.log(error)
        toast.error(
          error?.shortMessage ?? error?.message ?? 'TransactionExecutionError',
        )
        throw error
      })

      await submitCancelOrderAsync({
        orderId,
        txHash,
      })

      await queryClient.invalidateQueries({
        queryKey: [searchUserOrderUrl, 1],
      })
      setSubmitting(false)
      toast.success('Order canceled successfully')
    } catch (error) {
      setSubmitting(false)
    }
  }

  const columns: Column<SearchUserOrderResponse>[] = [
    {
      field: 'projectName',
      headerName: 'TOKEN',
      renderCell: ({ row }) => {
        return (
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
        )
      },
    },
    {
      field: 'createTime',
      headerName: 'TIME',
      renderCell: ({ row }) => {
        return (
          <time>
            {row.createTime
              ? dayjs(row.createTime).format('MM/DD HH:mm:ss')
              : 'Invalid Date'}
          </time>
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
      field: 'id',
      headerName: 'ACTION',
      renderCell: ({ row }) => {
        return (
          <CancelButton
            onClick={() => handleCancel(row.id)}
            id={row.id}
            loading={submitting}
          />
        )
      },
    },
  ]

  return (
    <div>
      <DataGrid<SearchUserOrderResponse>
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

function CancelButton({
  onClick,
  id,
  loading,
}: {
  onClick: () => void
  id: number
  loading: boolean
}) {
  const [clickedId, setClickedId] = useState<number>()

  return (
    <button
      onClick={(event) => {
        const rowId = Number(event.currentTarget.dataset.rowId)
        setClickedId(rowId)
        onClick()
      }}
      data-row-id={id}
      type={'button'}
      disabled={clickedId === id && loading}
      className={
        'h-7 w-20 rounded border border-solid border-aaa/50 text-xs text-aaa'
      }
    >
      {clickedId === id && loading ? (
        <span className={'loading loading-dots'} />
      ) : (
        'Cancel'
      )}
    </button>
  )
}
