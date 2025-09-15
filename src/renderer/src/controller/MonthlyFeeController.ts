import { CreateMonthly, Monthly_Fee_Write } from '@type/interfaces/monthly_fee'
import { BaseController } from './BaseController'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'

class MonthlyFeeController extends BaseController {
  async list(studentId: number): Promise<Monthly_Fee_Record[]> {
    return super.handleIpc(window.monthly_fee.list(studentId))
  }
  async create(studentId: number, data: Omit<CreateMonthly, 'studentId'>): Promise<boolean> {
    return super.handleIpc(window.monthly_fee.create({ ...data, studentId }))
  }
  async update(id: number, data: Partial<Monthly_Fee_Write>): Promise<boolean> {
    return super.handleIpc(window.monthly_fee.update(id, data))
  }
}

export default new MonthlyFeeController()
