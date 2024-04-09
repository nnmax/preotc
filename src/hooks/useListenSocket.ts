import { useRef } from 'react'
import type { SearchMarketOrderResponse } from '@/api'

export default function useListenSocket({
  onNewMarket,
}: {
  onNewMarket?: (data: SearchMarketOrderResponse) => void
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
