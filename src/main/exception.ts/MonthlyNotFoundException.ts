import { exceptionMessge } from '@main/utils/constant/exceptionMessage'
import BaseException from './BaseException'

export default class MonthlyNotFoundException extends BaseException {
  constructor(message: string | null = null, statusCode: number = 404, details?: unknown) {
    message ??= exceptionMessge.monthly_not_found
    super(message, statusCode, details)
  }
}
