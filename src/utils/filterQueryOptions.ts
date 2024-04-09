export default function filterQueryOptions<T extends Record<string, unknown>>(
  options: T,
): T {
  const { query, ...rest } = options

  return rest as T
}
