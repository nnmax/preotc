import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

const genTgLinkApi = '/pre-otc/generate-telegram-invitation-link'

type GenTgLinkData = {
  invitaitonCode: string
  indate: string
  serverTime: string
  invitationLink: string
}

export type UseGenTgLinkParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<GenTgLinkData, DefaultError, void, Context>
    | undefined
}

export function useGenTgLink<Context = unknown>(
  parameters: UseGenTgLinkParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [genTgLinkApi],
    mutationFn() {
      return fetcher(genTgLinkApi, {
        method: 'GET',
      })
    },
  })

  return {
    ...result,
    genTgLink: mutate,
    genTgLinkAsync: mutateAsync,
  }
}
