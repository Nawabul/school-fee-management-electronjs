import AdmissionService from '@main/service/AdmissionService'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import { BaseController } from './BaseController'

class AddmissionController extends BaseController {
  private service: typeof AdmissionService

  constructor() {
    super()
    this.service = AdmissionService

    this.create.bind(this)
    this.list.bind(this)
  }

  async create(
    _event: IpcMainInvokeEvent,
    data: Admission_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = this.service.promote(data)

      return super.processSuccess(result, 'Student promoted successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Admission_Record[]> | errorResponse> {
    try {
      const result = await this.service.list(studentId)

      return super.processSuccess(result, 'Student admission list')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }
}

export default new AddmissionController()
