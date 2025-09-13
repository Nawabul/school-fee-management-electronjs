import {
  Payment_Read,
  Payment_Record,
  Payment_Type,
  Payment_Write
} from '../../types/interfaces/payment'
import { successResponse, errorResponse } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import PaymentService from '../service/PaymentService'
import { BaseController } from './BaseController'
import PaymentNotFoundException from '@main/exception.ts/PaymentNotFoundException'

class PaymentController extends BaseController {
  private service: typeof PaymentService

  constructor() {
    super()
    this.service = PaymentService
  }

  async create(
    _event: IpcMainInvokeEvent,
    data: Payment_Write,
    type: Payment_Type = 'admission'
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = this.service.create(data, type)

      return super.processSuccess(result, 'Payment created successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Payment_Write
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = this.service.update(id, data)

      return super.processSuccess(result, 'Payment updated successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = this.service.delete(id)

      return super.processSuccess(result, 'Payment deleted successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  //@ts-ignore event not used
  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Payment_Record[]> | errorResponse> {
    try {
      const result = await this.service.list(studentId)

      return super.processSuccess(result, 'Student payment list successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Payment_Read> | errorResponse> {
    try {
      const result = this.service.get(id)

      if (!result) {
        throw new PaymentNotFoundException()
      }

      return super.processSuccess(result, 'Payment created successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }
}

export default new PaymentController()
