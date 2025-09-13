import { IpcMainInvokeEvent } from 'electron'
import {
  Mis_Charge_Read,
  Mis_Charge_Record,
  Mis_Charge_Write
} from '../../types/interfaces/mis_charge'
import { successResponse, errorResponse } from '../../types/utils/apiReturn'
import MisChargeService from '../service/MisChargeService'
import { BaseController } from './BaseController'
import MisChargeNotFoundException from '@main/exception.ts/MisChargeNotFoundException'

class MisChargeController extends BaseController {
  private service: typeof MisChargeService

  constructor() {
    super()
    this.service = MisChargeService

    this.create.bind(this)
    this.update.bind(this)
    this.delete.bind(this)
    this.list.bind(this)
    this.fetch.bind(this)
  }
  async create(
    _event: IpcMainInvokeEvent,
    data: Mis_Charge_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = this.service.create(data)

      return super.processSuccess(result, 'Mis. charge created successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Mis_Charge_Write
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = this.service.update(id, data)

      return super.processSuccess(result, 'Mis. charge updated successfully')
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

      return super.processSuccess(result, 'Mis. charge delted successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  //@ts-ignore event not used
  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Mis_Charge_Record[]> | errorResponse> {
    try {
      const result = this.service.list(studentId)

      return super.processSuccess(result, 'Student Mis. charge list successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Mis_Charge_Read> | errorResponse> {
    try {
      const result = this.service.get(id)

      if (!result) {
        throw new MisChargeNotFoundException()
      }

      return super.processSuccess(result, 'Mis. charge fetched successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }
}

export default new MisChargeController()
