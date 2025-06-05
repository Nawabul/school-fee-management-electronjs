import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'
import { successResponse } from '../../../types/utils/apiReturn'
class MonthlyFeeController {
  async list(studentId: number): Promise<Monthly_Fee_Record[]> {
    const result = await window.monthly_fee.list(studentId)
    console.log(result)
    if (result.success) {
      return (result as successResponse<Monthly_Fee_Record[]>).data
    }
    throw result.message
  }
}

export default new MonthlyFeeController()
