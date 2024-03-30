import OfferLayout from '@/components/OfferLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OfferLayout linkTitle={'Create Offer'}>{children}</OfferLayout>
}
