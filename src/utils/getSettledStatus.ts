import dayjs from 'dayjs'

export default function getSettledStatus(
  deadline: string | null,
  type: 1 | 2 | null,
) {
  if (type === 2) {
    if (deadline === null || !dayjs().isBefore(dayjs(deadline))) return false
    return true
  }
  return null
}
