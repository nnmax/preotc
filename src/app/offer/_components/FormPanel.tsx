import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import WalletSvg from '@/images/wallet.svg'
import BlurButton from '@/components/BlurButton'
import TokenHeader from '@/components/TokenHeader'
import FirstStepPanel from './FirstStepPanel'
import SecondStepPanel from './SecondStepPanel'

const total = 800000
const per = 0.44

export interface FormPanelProps {
  type: 'buy' | 'sell'
}

export default function FormPanel({ type }: FormPanelProps) {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [rangeValue, setRangeValue] = useState(total)
  const [step, setStep] = useState(1)

  let stepPanel = null
  let stepButton = null
  if (step === 1) {
    stepPanel = (
      <FirstStepPanel
        type={type}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
      />
    )
    stepButton = (
      <BlurButton
        bgColorClass={
          type === 'buy'
            ? rangeValue <= 0
              ? 'bg-[#1B3F93]'
              : 'bg-[#1058FF]'
            : rangeValue <= 0
              ? 'bg-[#8F2760]'
              : 'bg-[#EB2F96]'
        }
        disabled={rangeValue <= 0}
        disabledBlur={rangeValue <= 0}
        onClick={() => {
          setStep(2)
        }}
      >
        {'Next'}
      </BlurButton>
    )
  }
  if (step === 2) {
    stepPanel = (
      <SecondStepPanel
        amount={rangeValue}
        pricePerToken={per}
        type={type}
        price={rangeValue * per}
      />
    )
    stepButton = (
      <BlurButton
        bgColorClass={'bg-[#FBFC02]'}
        className={'text-black'}
        onClick={() => {}}
      >
        {`Deposit ${(rangeValue * per).toLocaleString()} USDB`}
      </BlurButton>
    )
  }

  return (
    <div className={'flex flex-col'}>
      <TokenHeader
        id={345}
        name={'AKAK'}
        twitterUrl={'https://x.com'}
        avatarUrl={'https://fakeimg.pl/24x24/D8D8D8/?text=T'}
      />
      {stepPanel}
      {address ? (
        stepButton
      ) : (
        <BlurButton
          bgColorClass={'bg-[#FA5151]'}
          onClick={() => {
            openConnectModal!()
          }}
        >
          <Image src={WalletSvg} alt={'next'} width={'32'} className={'mr-5'} />
          {'Connect Wallet'}
        </BlurButton>
      )}
    </div>
  )
}
