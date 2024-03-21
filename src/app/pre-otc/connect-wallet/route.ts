import { NextResponse } from 'next/server'
import type { CommonResponse, ConnectWalletResponse } from '@/api'

export async function POST(request: Request) {
  const { address, chatId } = await request.json()
  const body: CommonResponse<ConnectWalletResponse> = {
    code: 200,
    message: 'Ok',
    prompt: 'success',
    timestamp: Date.now(),
    data: {
      address,
      chatId,
      createTime: new Date().toUTCString(),
      message: 'default message',
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIweDQxQ2QzQjJmYkY1OEVCMzk0NDBGN0ZkNzI3MTRlMjQ5RDAzNTQyRUIiLCJpYXQiOjE3MTA2ODE4MjYsImV4cCI6MTcxMDc2ODIyNn0.VcA4pHZYavJrzj534_obhP_nLAXOJK86IkpM3ah0TDHUWEALQ7vw4_DVB39BWSokzHJQdkZF6xA2nKhJkJUlpA',
    },
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(NextResponse.json(body))
    }, 1000)
  })
}
