/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_ENDPOINT: string
    NEXT_PUBLIC_SOCKET_ENDPOINT: string
    NEXT_PUBLIC_IS_DEV: 'true'
    WALLET_CONNECT_VERIFICATION: string
  }
}
