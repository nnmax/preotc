import Decimal from 'decimal.js'
import type { UseFormSetValue } from 'react-hook-form'
import type { FormValues } from '@/app/create/types'

export default function setMinNumber(options: {
  setValue: UseFormSetValue<FormValues>
  field: keyof FormValues
  value: string
  min: number
}) {
  const { field, min, setValue, value } = options
  if (value === '') setValue(field, String(min))
  if (new Decimal(value).lessThan(min)) setValue(field, String(min))
  else setValue(field, Math.round(Number(value)).toString())
}
