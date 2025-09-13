import MonthlyFeeService from '../service/MonthlyFeeService'
import { errorResponse, successResponse } from '../../types/utils/apiReturn'
import {
  CreateMonthly,
  Monthly_Fee_Record,
  Monthly_Fee_Write
} from '../../types/interfaces/monthly_fee'
import { IpcMainInvokeEvent } from 'electron'
import { BaseController } from './BaseController'

class MonthlyFeeController extends BaseController {
  private service: typeof MonthlyFeeService

  constructor() {
    super()
    this.service = MonthlyFeeService

    this.create.bind(this)
    this.update.bind(this)
    this.list.bind(this)
  }
  async create(
    _event: IpcMainInvokeEvent,
    data: CreateMonthly
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = this.service.create(data)

      return super.processSuccess(result, 'Monthly creatated successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Partial<Monthly_Fee_Write>
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = this.service.update(id, data)

      return super.processSuccess(result, 'Monthly update successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async list(
    _event: IpcMainInvokeEvent,
    student_id: number
  ): Promise<successResponse<Monthly_Fee_Record[]> | errorResponse> {
    try {
      const result = this.service.listOfStudent(student_id)

      return super.processSuccess(result, 'Monthly list successfully')
    } catch (error) {
      return super.processError(error)
    }
  }
}

export default new MonthlyFeeController()
