import fetcher from '@/api/fetcher'
import { useQuery } from '@/utils/query'
import type { QueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const tgLinkInfoApi = '/pre-otc/get-telegram-invitation-info'

export type TgLinkInfoParams = {
  invitaitonCode: string
}

export type TgLinkInfoData = number

export type TgLinkInfoOptions = Partial<TgLinkInfoParams>

export function tgLinkInfoKey(options: TgLinkInfoOptions) {
  return [tgLinkInfoApi, options] as const
}

export type UseTgLinkInfoParams<SelectData = TgLinkInfoData> =
  TgLinkInfoOptions &
    QueryParameter<
      TgLinkInfoData,
      DefaultError,
      SelectData,
      ReturnType<typeof tgLinkInfoKey>
    >

export function useTgLinkInfo<SelectData = TgLinkInfoData>(
  parameters: UseTgLinkInfoParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useQuery({
    ...query,
    gcTime: 0,
    staleTime: 0,
    queryKey: tgLinkInfoKey(rest),
    queryFn({ queryKey }) {
      return fetcher(
        queryKey[0] + '?invitaitonCode=' + queryKey[1].invitaitonCode,
        {
          method: 'GET',
          disabledErrorToast: true,
        },
      )
    },
  })
}
