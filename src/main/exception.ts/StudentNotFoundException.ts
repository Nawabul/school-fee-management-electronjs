import { exceptionMessge } from '@main/utils/constant/exceptionMessage'
import BaseException from './BaseException'

export default class StudnetNotFoundException extends BaseException {
  constructor(message: string | null = null, statusCode: number = 404, details?: unknown) {
    message ??= exceptionMessge.student_not_found
    super(message, statusCode, details)
  }
}
