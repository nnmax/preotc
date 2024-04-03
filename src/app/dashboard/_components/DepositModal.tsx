import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import Dialog from '@/components/Dialog'
import {
  settledDeposit,
  settledDepositUrl,
  type SearchUserOrderResponse,
} from '@/api'
import type { SettledDepositParams } from '@/api'

interface DepositModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  currentData: SearchUserOrderResponse | undefined
  onSuccess?: () => void
}

export default function DepositModal({
  open,
  setOpen,
  currentData,
  onSuccess,
}: DepositModalProps) {
  const { mutateAsync: settledDepositAsync, isPending } = useMutation({
    mutationKey: [settledDepositUrl],
    mutationFn: (variables: SettledDepositParams) => {
      return settledDeposit(variables)
    },
  })

  const handleDeposit = async () => {
    await settledDepositAsync({
      id: currentData!.id,
    })
    onSuccess && onSuccess()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      showCloseButton={false}
      panelClassName={'!max-w-[480px]'}
    >
      <div className={'mt-5 flex flex-col items-center text-xs'}>
        <div className={'flex w-full justify-between'}>
          <span className={'text-[#9E9E9E]'}>{'TOKEN'}</span>
          {currentData && (
            <span className={'flex items-center'}>
              <Image
                src={currentData?.projectAvatarUrl}
                alt={currentData?.projectName}
                width={'24'}
                height={'24'}
                className={'mr-2 rounded-full'}
              />
              {currentData?.projectName}
            </span>
          )}
        </div>
        <div className={'mt-10 flex w-full justify-between'}>
          <span className={'text-[#9E9E9E]'}>{'AMOUNT'}</span>
          <span>{currentData?.amount}</span>
        </div>
        <button
          disabled={isPending}
          type={'button'}
          onClick={handleDeposit}
          className={
            'mt-11 flex h-9 w-[140px] items-center justify-center rounded-[5px] bg-[#EB2F96]'
          }
        >
          {isPending ? <span className={'loading loading-dots'} /> : 'Deposit'}
        </button>
      </div>
    </Dialog>
  )
}
