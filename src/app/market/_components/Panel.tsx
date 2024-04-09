import Card from './Card'
import type { MarketOrderData } from '@/api/query'

export default function Panel({ data }: { data: MarketOrderData[] }) {
  if (!data || !data.length) return <p>{'No Data'}</p>
  return data.map((item) => <Card key={item.id} data={item} />)
}
