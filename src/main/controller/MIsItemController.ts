import { IpcMainInvokeEvent } from 'electron'
import { Mis_Item_Write, Mis_Item_Read, Mis_Item_Record } from '../../types/interfaces/mis_item'
import { successResponse, errorResponse } from '../../types/utils/apiReturn'
import { BaseController } from './BaseController'
import MisItemService from '../service/MisItemService'

class MisItemController extends BaseController {
  private service: typeof MisItemService

  constructor() {
    super()
    this.service = MisItemService
  }

  async create(
    _event: IpcMainInvokeEvent,
    data: Omit<Mis_Item_Write, 'id'>
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = await this.service.create(data)
      return super.processSuccess(result, 'MIS Item created successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Omit<Mis_Item_Write, 'id'>
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await this.service.update(id, data)

      return super.processSuccess(result, 'MIS Item updated successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number | number[]
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await this.service.delete(id)
      return super.processSuccess(result, 'MIS Item(s) deleted successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  //@ts-ignore event not used
  async list(): Promise<successResponse<Mis_Item_Record[]> | errorResponse> {
    try {
      const result = await this.service.list()
      return super.processSuccess(result, 'MIS Item(s) fetched successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Mis_Item_Read> | errorResponse> {
    try {
      const result = await this.service.get(id)
      if (!result) {
        return super.processError(new Error('MIS Item not found'))
      }
      return super.processSuccess(result, 'MIS Item fetched successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }
}

export default new MisItemController()
