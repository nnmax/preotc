import { NextResponse } from 'next/server'
import type {
  CommonResponse,
  GenerateTelegramInvitationLinkResponse,
} from '@/api'

const code = Math.random().toString(36).slice(-6)

const body: CommonResponse<GenerateTelegramInvitationLinkResponse> = {
  code: 200,
  message: 'Ok',
  prompt: 'success',
  timestamp: Date.now(),
  data: {
    invitaitonCode: code,
    indate: '600',
    serverTime: new Date().toISOString(),
    invitationLink: `https://t.me/dev_flipgod_notification_bot?start=${code}`,
  },
}

export async function GET() {
  return new Promise<
    NextResponse<CommonResponse<GenerateTelegramInvitationLinkResponse>>
  >((resolve) => {
    setTimeout(() => {
      resolve(NextResponse.json(body))
    }, 1000)
  })
}
