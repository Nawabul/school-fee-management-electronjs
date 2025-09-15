import { BaseController } from './BaseController'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'

class MonthlyFeeController extends BaseController {
  async list(studentId: number): Promise<Monthly_Fee_Record[]> {
    return super.handleIpc(window.monthly_fee.list(studentId))
  }
}

export default new MonthlyFeeController()
