import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseMutateFunction
} from '@tanstack/react-query'
import useServerResponse, { Handler } from '@renderer/hooks/useServerResponse'

type MutationHandlerOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, string, TVariables>,
  'mutationFn'
> & {
  mutationFn: (variables: TVariables) => Handler<TData> // must return Handler<TData>
}

type MutationHandlerResult<TData, TVariables> = Omit<
  UseMutationResult<TData, string, TVariables>,
  'mutate' | 'mutateAsync'
> & {
  mutate: UseMutateFunction<TData, string, TVariables>
  mutateAsync: (variables: TVariables) => Promise<TData>
}

export function useMutationHandler<TData, TVariables = void>(
  options: MutationHandlerOptions<TData, TVariables>
): MutationHandlerResult<TData, TVariables> {
  const { mutationFn: handler, ...rest } = options
  const { mutationFn } = useServerResponse()

  // Wrap the server response to return TData instead of response<TData>
  const wrappedMutationFn = async (variables: TVariables): Promise<TData> => {
    const res = await mutationFn(handler)(variables) // res: response<TData>
    return res // unwrap to TData
  }

  const result = useMutation<TData, string, TVariables>({
    ...rest,
    mutationFn: wrappedMutationFn
  })

  // Wrap mutate to work with TData
  const mutate: UseMutateFunction<TData, string, TVariables> = (variables, mutateOptions) => {
    return result.mutate(variables, mutateOptions)
  }

  const mutateAsync = async (variables: TVariables): Promise<TData> => {
    const res = await result.mutateAsync(variables)
    return res // already TData
  }

  return { ...result, mutate, mutateAsync }
}

export default useMutationHandler
