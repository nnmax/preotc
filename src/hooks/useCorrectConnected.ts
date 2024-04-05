'use client'
import { useEffect, useState } from 'react'
import { useAccount, useConnections } from 'wagmi'
import type { WalletType } from '@/types'

export default function useCorrectConnected() {
  const [correctConnected, setCorrectConnected] = useState(false)
  const { address } = useAccount()
  const connections = useConnections()
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    setCompleted(false)
    if (!address || !connections.length) {
      setCompleted(true)
      return
    }
    const walletName = connections[0].connector.name.toLowerCase() as WalletType
    if (walletName === 'BTC') {
      setCompleted(true)
      return
    }
    setCompleted(true)
    setCorrectConnected(true)
  }, [connections, address])

  return { correctConnected, completed }
}
