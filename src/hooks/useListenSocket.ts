import { useRef } from 'react'
// import { io } from 'socket.io-client'
// import { NewMarketEvent } from '@/constant'
import type { MarketOrderData } from '@/api/query'

export default function useListenSocket({
  onNewMarket,
}: {
  onNewMarket?: (data: MarketOrderData) => void
}) {
  const onNewMarketRef = useRef(onNewMarket)
  onNewMarketRef.current = onNewMarket

  // useEffect(() => {
  //   const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT, {
  //     transports: ['websocket'],
  //     closeOnBeforeunload: true,
  //   })

  //   if (onNewMarketRef.current)
  //     socket.on(NewMarketEvent, onNewMarketRef.current)

  //   return () => {
  //     if (onNewMarketRef.current)
  //       socket.off(NewMarketEvent, onNewMarketRef.current)
  //     socket.disconnect()
  //   }
  // }, [])
}
