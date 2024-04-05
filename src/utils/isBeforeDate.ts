import dayjs from 'dayjs'

export default function isBeforeDate(deadline: string | null) {
  if (deadline === null) return null
  return dayjs().isBefore(dayjs(deadline))
}
