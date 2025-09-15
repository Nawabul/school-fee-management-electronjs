import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import useServerResponse, { Handler } from '@renderer/hooks/useServerResponse'

interface Props<TData, TSelect = TData>
  extends Omit<
    UseQueryOptions<TData, string, TSelect>, // TData = unwrapped data
    'onError' | 'onSuccess' | 'queryFn'
  > {
  queryFn: Handler<TData> // <- can be a function returning response<T> | Promise<response<T>>
  onSuccess?: (data: TData) => void
  onError?: (err: string) => void
}

function useQueryHandler<TData = unknown, TSelect = TData>(
  options: Props<TData, TSelect>
): UseQueryResult<NoInfer<TSelect>, string> {
  const { queryFn: handler, ...rest } = options
  const { queryFn } = useServerResponse()

  const result = useQuery({
    ...rest,
    queryFn: queryFn(handler) // returns () => Promise<TData>, exactly what useQuery expects
  })

  return result
}

export default useQueryHandler
