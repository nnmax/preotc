import fetcher from '@/api/fetcher'

export const getTelegramInvitationInfoUrl =
  '/pre-otc/get-telegram-invitation-info'

export const fetchGetTelegramInvitationInfo = (code: string) => {
  return fetcher<number>(
    getTelegramInvitationInfoUrl + '?invitaitonCode' + code,
    {
      method: 'GET',
    },
  )
}
