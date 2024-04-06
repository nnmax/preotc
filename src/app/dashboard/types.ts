import type { SearchUserOrderResponse } from '@/api'

export interface TableCommonProps {
  rows: SearchUserOrderResponse[] | undefined
  completed: boolean
  correctConnected: boolean
  isPending: boolean
}
