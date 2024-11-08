'use client'
import React from 'react'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  // okxWallet,
  // phantomWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { base, mainnet, blast, zkSync } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import BlastIcon from '@/images/blast-icon.svg'
import EthIcon from '@/images/eth-20x20.png'
import BaseIcon from '@/images/base-20x20.png'
import ZkSyncIcon from '@/images/zkSync.png'
import { BLAST_TESTNET_CHAIN_ID } from '@/constant'
import { LoggedInProvider } from '@/hooks/useLoggedIn'
import type { Chain } from 'wagmi/chains'

const blastSepolia: Chain = {
  id: BLAST_TESTNET_CHAIN_ID,
  name: 'Blast Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://testnet.blast.din.dev/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Testnet Blastscan', url: 'https://testnet.blastscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 212929,
    },
  },
}

export const config = getDefaultConfig({
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
        // okxWallet,
        // phantomWallet,
      ],
    },
  ],
  chains: [
    {
      ...mainnet,
      iconUrl: EthIcon.src,
      iconBackground: '#000',
    },
    {
      ...blast,
      iconUrl: BlastIcon.src,
      iconBackground: '#000',
    },
    ...(process.env.NEXT_PUBLIC_IS_DEV === 'true'
      ? [
          {
            ...blastSepolia,
            iconUrl: BlastIcon.src,
            iconBackground: '#000',
          },
        ]
      : []),
    {
      ...base,
      iconUrl: BaseIcon.src,
      iconBackground: '#000',
    },
    {
      ...zkSync,
      iconUrl: ZkSyncIcon.src,
      iconBackground: '#000',
    },
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
          <LoggedInProvider>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </LoggedInProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
