import BaseException from '@main/exception.ts/BaseException'
import ServerException from '@main/exception.ts/ServerException'

export abstract class BaseService {

  processError(error: unknown): void {
    if (error instanceof BaseException) {
      // known business exception -> just rethrow
      throw error
    }
    if (error instanceof Error) {
      // generic error -> wrap in your own exception or rethrow
      throw new ServerException()
    }
    // fallback for unknown cases
    throw new ServerException('Unknow error')
  }
}
