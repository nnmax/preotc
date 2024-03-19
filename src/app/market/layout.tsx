import Tabs from './_components/Tabs'

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Tabs>{children}</Tabs>
}
