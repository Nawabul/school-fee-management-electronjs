import { successResponse, errorResponse } from '@type/utils/apiReturn'

export abstract class BaseController {
  /**
   * Handle successful API responses
   * @param data - the returned data
   * @param message - success message
   */
  protected processSuccess<T>(data: T, message?: string): successResponse<T> {
    return {
      success: true,
      message: message ?? 'Operation successful',
      data
    }
  }

  /**
   * Handle error API responses
   * @param error - Error object or message
   */
  protected processError(error: unknown): string {
    let message = 'Unknown error occurred'

    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      //@ts-expect-error unknow error handle
      message = (error as unknown)?.message ?? 'Unknown error'
    }

    return message
  }

  /**
   * Utility to handle IPC calls and automatically throw errors
   */
  protected async handleIpc<T>(ipcCall: Promise<successResponse<T> | errorResponse>): Promise<T> {
    try {
      const result = await ipcCall
      console.log(result)
      if (result.success) {
        return (result as successResponse<T>).data
      } else {
        throw (result as errorResponse).message
      }
    } catch (error) {
      console.log(error)
      throw this.processError(error)
    }
  }
}
