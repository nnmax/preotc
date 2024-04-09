import type { UserOrderData } from '@/api/query'

export interface TableCommonProps {
  rows: UserOrderData[] | undefined
  completed: boolean
  correctConnected: boolean
  isLoading: boolean
}
