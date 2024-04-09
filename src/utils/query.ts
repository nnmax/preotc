import {
  type DefaultError,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
  useQuery as useReactQuery,
  useSuspenseQuery as useSuspenseReactQuery,
} from '@tanstack/react-query'

export type UseMutationParameters<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'mutationKey' | 'throwOnError'
>

export type UseMutationReturnType<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
> = /* Union */ Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  'mutate' | 'mutateAsync'
>

export type UseQueryParameters<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Partial<
  Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'initialData'>
> & {
  // Fix `initialData` type
  initialData?:
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>['initialData']
    | undefined
}

export type UseSuspenseQueryParameters<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Partial<
  Omit<
    UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  >
> & {
  // Fix `initialData` type
  initialData?:
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>['initialData']
    | undefined
}

export type UseQueryReturnType<
  TData = unknown,
  TError = DefaultError,
  TQueryKey = QueryKey,
> = UseQueryResult<TData, TError> & {
  queryKey: TQueryKey
}

export type UseSuspenseQueryReturnType<
  TData = unknown,
  TError = DefaultError,
  TQueryKey = QueryKey,
> = UseSuspenseQueryResult<TData, TError> & {
  queryKey: TQueryKey
}

// Adding some basic customization.
// Ideally we don't have this function, but `import('@tanstack/react-query').useQuery` currently has some quirks where it is super hard to
// pass down the inferred `initialData` type because of it's discriminated overload in the on `useQuery`.
export function useQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>(
  parameters: UseQueryParameters<TQueryFnData, TError, TData, TQueryKey> & {
    queryKey: TQueryKey
  },
): UseQueryReturnType<TData, TError, TQueryKey> {
  const result = useReactQuery(parameters) as UseQueryReturnType<
    TData,
    TError,
    TQueryKey
  >
  result.queryKey = parameters.queryKey
  return result
}

export function useSuspenseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>(
  parameters: UseSuspenseQueryParameters<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > & {
    queryKey: TQueryKey
  },
): UseSuspenseQueryReturnType<TData, TError, TQueryKey> {
  const result = useSuspenseReactQuery(
    parameters,
  ) as UseSuspenseQueryReturnType<TData, TError, TQueryKey>
  result.queryKey = parameters.queryKey
  return result
}
