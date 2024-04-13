import type { UseFormSetValue } from 'react-hook-form'
import type { FormValues } from '@/app/create/types'

export default function setMinNumber(options: {
  setValue: UseFormSetValue<FormValues>
  field: keyof FormValues
  value: number | string
  min: number
}) {
  const { field, min, setValue, value } = options
  if (value === '') setValue(field, min)
  if (Number(value) < min) setValue(field, min)
  else setValue(field, Math.round(Number(value)))
}
