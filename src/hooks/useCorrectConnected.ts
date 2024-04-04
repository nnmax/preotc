'use client'
import { useEffect, useState } from 'react'
import { useAccount, useConnections } from 'wagmi'
import type { WalletType } from '@/types'

export default function useCorrectConnected() {
  const [correctConnected, setCorrectConnected] = useState(false)
  const { address } = useAccount()
  const connections = useConnections()

  useEffect(() => {
    if (!address || !connections.length) return
    const walletName = connections[0].connector.name.toLowerCase() as WalletType
    if (walletName === 'BTC') return
    setCorrectConnected(true)
  }, [connections, address])

  return { correctConnected }
}
