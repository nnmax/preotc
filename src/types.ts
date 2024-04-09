import type {
  UseQueryParameters,
  UseSuspenseQueryParameters,
} from '@/utils/query'
import type { DefaultError, QueryKey } from '@tanstack/react-query'

export type WalletType = 'ETH' | 'BTC' | 'SOL'

export interface QueryParameter<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> {
  query?:
    | Omit<
        UseQueryParameters<queryFnData, error, data, queryKey>,
        'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'throwOnError'
      >
    | undefined
}

export interface SuspenseQueryParameter<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> {
  query?:
    | Omit<
        UseSuspenseQueryParameters<queryFnData, error, data, queryKey>,
        'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'throwOnError'
      >
    | undefined
}
