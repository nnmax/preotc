'use client'
import React from 'react'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  okxWallet,
  phantomWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { base, mainnet, blast, zkSync } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import BlastIcon from '@/images/blast-icon.svg'

const config = getDefaultConfig({
  appName: 'Preotc',
  projectId: '60f242737f175a70e868fe0dda3a1f40',
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
        okxWallet,
        phantomWallet,
      ],
    },
  ],
  chains: [
    mainnet,
    {
      ...blast,
      iconUrl: BlastIcon.src,
      iconBackground: '#000',
    },
    base,
    zkSync,
  ],
  ssr: true,
})

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        retry: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  return (browserQueryClient ??= makeQueryClient())
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={getQueryClient()}>
        <ReactQueryStreamedHydration>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
