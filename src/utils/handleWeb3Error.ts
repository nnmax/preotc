import { toast } from 'react-toastify'

export default function handleWeb3Error(error: any) {
  console.log(error)
  toast.error(error?.shortMessage ?? error?.message ?? 'SwitchChainError')
  return null
}
