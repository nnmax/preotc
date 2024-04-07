import Card from './Card'
import type { SearchMarketOrderResponse } from '@/api'

export default function Panel({ data }: { data: SearchMarketOrderResponse[] }) {
  if (!data || !data.length) return <p>{'No Data'}</p>
  return data.map((item) => <Card key={item.id} data={item} />)
}
