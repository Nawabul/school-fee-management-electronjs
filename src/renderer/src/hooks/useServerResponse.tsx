// useServerResponse.ts
import useToast from '@renderer/hooks/toast/ToastContext'

/**
 * A value that can be a function returning T, a Promise<T>, or T itself
 */
export type Handler<T = void> = (() => Promise<T> | T) | Promise<T>

/**
 * Normalize successful response
 */

function getSuccess<T>(res: T): T {
  return res as T
}

/**
 * Normalize error response
 */
const getError = (err: unknown): string => {
  if (typeof err == 'string') {
    return err
  }
  return ' Something went wrong'
}

/**
 * Handle a value which can be a function or a promise
 */
const handleFunction = async <T,>(handler: Handler<T>): Promise<T> => {
  if (typeof handler === 'function') {
    const result = (handler as () => T | Promise<T>)()
    return await result // ✅ ensure Promise is awaited
  }
  if (handler && typeof handler.then === 'function') {
    return await handler // ✅ await the promise
  }
  return handler
}

/**
 * Wrapper for React Query `queryFn`
 */
export const queryFn = <T,>(
  handler: Handler<T>,
  errorAction: (error: string) => void
): (() => Promise<T>) => {
  return async (): Promise<T> => {
    try {
      const response = await handleFunction(handler)
      // successAction(response);
      const data = getSuccess<T>(response)

      return data
    } catch (error) {
      if (typeof error == 'string') {
        errorAction(error)
      }
      throw getError(error)
    }
  }
}

/**
 * Wrapper for React Query `mutationFn`
 */
export const mutationFn = <TData, TVariables = unknown>(
  handler: (variables: TVariables) => Handler<TData>,
  successAction?: (response: TData) => void,
  errorAction?: (error: string) => void
) => {
  return async (variables: TVariables): Promise<TData> => {
    try {
      const payload = variables

      const response = await handleFunction(handler(payload))
      successAction?.(response)
      return getSuccess<TData>(response)
    } catch (error: unknown) {
      console.log(error)
      if (typeof error == 'string') {
        errorAction?.(error)
      }
      throw getError(error)
    }
  }
}

/**
 * Optional main hook export
 */

type useServerResponse = {
  queryFn: <T>(handler: Handler<T>) => () => Promise<T>
  mutationFn: <TData, TVariables = unknown>(
    handler: (variables: TVariables) => Handler<TData>
  ) => (variables: TVariables) => Promise<TData>
}
export function useServerResponse(): useServerResponse {
  const { showToast } = useToast()
  const successAction = (): void => {
    showToast('Success', 'success')
  }

  const errorAction = (err: string): void => {
    showToast(err, 'error')
  }

  const result = {
    queryFn: <T,>(handler: Handler<T>) => queryFn(handler, errorAction),
    mutationFn: <TData, TVariables = unknown>(handler: (variables: TVariables) => Handler<TData>) =>
      mutationFn<TData, TVariables>(handler, successAction, errorAction)
  }

  return result
}

export default useServerResponse
