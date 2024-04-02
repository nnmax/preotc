import clsx from 'clsx'
import { stepPanelClasses } from '@/constant'

interface FirstStepPanelProps {
  type: 'buy' | 'sell'
  rangeValue: number
  setRangeValue: React.Dispatch<React.SetStateAction<number>>
  max: number | undefined
  pricePerToken: number | undefined
  unit: string | undefined
}

export default function FirstStepPanel({
  type,
  rangeValue,
  setRangeValue,
  max,
  pricePerToken,
  unit,
}: FirstStepPanelProps) {
  const labelText = type === 'buy' ? 'Buying' : 'Selling'
  const labelBg = type === 'buy' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'
  const rangeShdw = type === 'buy' ? '#FFC300' : '#EB2F96'

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(e.target.value))
  }

  return (
    <div className={clsx(stepPanelClasses)}>
      <div className={'flex items-center justify-between'}>
        <span
          className={clsx(
            'rounded-[3px] px-2 text-sm leading-6 text-black',
            labelBg,
          )}
        >
          {labelText}
        </span>
        <span
          className={'text-xs text-[#9B9B9B]'}
        >{`$ ${pricePerToken} / ${unit}`}</span>
      </div>
      <div className={'my-5'}>
        <span className={''}>{rangeValue}</span>
      </div>
      <div className={'flex items-center justify-between gap-[52px]'}>
        <input
          type={'range'}
          className={'range flex-1'}
          min={0}
          max={max ?? 0}
          onChange={handleRangeChange}
          value={rangeValue}
          style={{
            '--range-shdw': rangeShdw,
          }}
        />
        <span
          className={clsx(
            'w-[74px] rounded-[3px] text-center leading-6 text-black',
            labelBg,
          )}
        >
          {`${((rangeValue / (max || 0)) * 100 || 0).toFixed(0)} %`}
        </span>
      </div>
      <div className={'mt-[60px] flex flex-col gap-3'}>
        <span className={'text-[#737373]'}>{'For'}</span>
        <span
          className={'text-[#FFC300]'}
        >{`${((pricePerToken || 0) * rangeValue).toLocaleString()}`}</span>
      </div>
    </div>
  )
}
