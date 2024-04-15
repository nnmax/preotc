import fetcher from '@/api/fetcher'
import { useQuery } from '@/utils/query'
import useLoggedIn from '@/hooks/useLoggedIn'
import type { MarketOrderData } from '@/api/query/marketOrder'
import type { QueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const userOrderApi = '/pre-otc/search-user-order'

export type UserOrderParams = {
  /**
   * My_Offers(1)
   * To_Be_Settled(2)
   * Deals_Completed(3)
   */
  dashboardType: 1 | 2 | 3
}

export type UserOrderData = MarketOrderData

export type UserOrderOptions = Partial<UserOrderParams>

export function userOrderKey(options: UserOrderOptions) {
  return [userOrderApi, options] as const
}

export type UseUserOrderParams<SelectData = UserOrderData[]> =
  UserOrderOptions &
    QueryParameter<
      UserOrderData[],
      DefaultError,
      SelectData,
      ReturnType<typeof userOrderKey>
    >

export function useUserOrder<SelectData = UserOrderData[]>(
  parameters: UseUserOrderParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  const { loggedIn } = useLoggedIn()
  const enabled = loggedIn && query.enabled

  return useQuery({
    ...query,
    enabled,
    queryKey: userOrderKey(rest),
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        body: JSON.stringify(queryKey[1]),
        method: 'POST',
      })
    },
  })
}
