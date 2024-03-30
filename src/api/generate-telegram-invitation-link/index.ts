import fetcher from '@/api/fetcher'

export const generateTelegramInvitationLinkUrl =
  '/pre-otc/generate-telegram-invitation-link'

export interface GenerateTelegramInvitationLinkResponse {
  invitaitonCode: string
  indate: string
  serverTime: string
  invitationLink: string
}

export const fetchGenerateTelegramInvitationLink = () => {
  return fetcher<GenerateTelegramInvitationLinkResponse>(
    generateTelegramInvitationLinkUrl,
    {
      method: 'GET',
    },
  )
}
