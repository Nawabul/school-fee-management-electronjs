import { exceptionMessge } from '@main/utils/constant/exceptionMessage'
import BaseException from './BaseException'

export default class EndDateBeforeStartDateException extends BaseException {
  constructor(message: string | null = null, statusCode: number = 404, details?: unknown) {
    message ??= exceptionMessge.end_date_before_start_date
    super(message, statusCode, details)
  }
}
