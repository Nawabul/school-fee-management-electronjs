import { exceptionMessge } from '@main/utils/constant/exceptionMessage'
import BaseException from './BaseException'

export default class MisItemNotFoundException extends BaseException {
  constructor(message: string | null = null, statusCode: number = 404, details?: unknown) {
    message ??= exceptionMessge.mis_item_not_found
    super(message, statusCode, details)
  }
}
