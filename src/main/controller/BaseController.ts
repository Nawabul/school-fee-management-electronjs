import { apiSuccess, apiError, successResponse, errorResponse } from '@type/utils/apiReturn'
import BaseException from '@main/exception.ts/BaseException'

export abstract class BaseController {
  // ✅ Standard success response
  protected processSuccess<T>(data: T, message = 'Success'): successResponse<T> {
    return apiSuccess(data, message)
  }

  // ✅ Standard error response
  protected processError(error: unknown, defaultMessage = 'Something went wrong'): errorResponse {
    if (error instanceof BaseException) {
      // Known business exception -> return its message
      return apiError(error.message)
    }
    if (error instanceof Error) {
      // Generic JS error -> return default or error message
      return apiError(error.message || defaultMessage)
    }
    // Fallback for unknown types
    return apiError(defaultMessage)
  }
}
