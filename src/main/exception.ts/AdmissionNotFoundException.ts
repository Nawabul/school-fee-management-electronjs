import { exceptionMessge } from '@main/utils/constant/exceptionMessage'
import BaseException from './BaseException'

export default class AdmissionNotFoundException extends BaseException {
  constructor(message: string | null = null, statusCode: number = 404, details?: unknown) {
    message ??= exceptionMessge.admission_not_found
    super(message, statusCode, details)
  }
}
