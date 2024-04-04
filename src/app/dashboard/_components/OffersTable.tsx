import Image from 'next/image'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'react-toastify'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { searchUserOrder, searchUserOrderUrl } from '@/api'
import { cancelOrder, cancelOrderUrl } from '@/api/cancel-order'
import WalletBlackSvg from '@/images/wallet-black.svg'
import Button from '@/components/Button'
import useCorrectConnected from '@/hooks/useCorrectConnected'
import { tdClasses, thClasses, trBorderClasses } from '../classes'
// import TablePagination from './TablePagination/TablePagination'

export default function OffersTable() {
  const { correctConnected } = useCorrectConnected()
  const { openConnectModal } = useConnectModal()
  const queryClient = useQueryClient()
  const { data: offers = [] } = useQuery({
    enabled: correctConnected,
    queryKey: [searchUserOrderUrl, 1],
    queryFn: () => {
      return searchUserOrder({
        dashboardType: 1,
      })
    },
  })
  const { mutateAsync: cancelOrderAsync, isPending: cancelingOrder } =
    useMutation({
      mutationKey: [cancelOrderUrl],
      mutationFn: cancelOrder,
    })
  const { sendTransactionAsync, isPending: sendingTransaction } =
    useSendTransaction()
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

  const handleCancel = async (orderId: number) => {
    const { cancelOrderCallData } = await cancelOrderAsync({
      orderId,
    })

    await sendTransactionAsync({
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

    toast.success('Order canceled successfully')
    queryClient.invalidateQueries({
      queryKey: [searchUserOrderUrl, 1],
    })
  }

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
            <th className={thClasses}>{'ACTION'}</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((item, index, arr) => (
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
                {item.type === 1 ? 'Buy' : 'Sell'}
              </td>
              <td className={tdClasses}>
                <button
                  onClick={() => handleCancel(item.id)}
                  type={'button'}
                  disabled={cancelingOrder || sendingTransaction}
                  className={
                    'rounded border border-solid border-[#aaa] px-3 py-[5px] text-xs text-[#aaa]'
                  }
                >
                  {cancelingOrder || sendingTransaction ? (
                    <span className={'loading loading-dots'} />
                  ) : (
                    'Cancel'
                  )}
                </button>
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
