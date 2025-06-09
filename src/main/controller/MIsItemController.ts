import { IpcMainInvokeEvent } from 'electron'
import { Mis_Item_Read, Mis_Item_Record, Mis_Item_Write } from '../../types/interfaces/mis_item'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import MisItemService from '../service/MisItemService'

class MisItemController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Mis_Item_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = await MisItemService.create(data)
      return apiSuccess(result, 'MIS Item created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating MIS Item: ' + error.message)
      }
      return apiError('Unknown error while creating MIS Item')
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Omit<Mis_Item_Record, 'id'>
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await MisItemService.update(id, data)
      if (!result) {
        return apiError('MIS Item not found or no changes made')
      }
      return apiSuccess(result, 'MIS Item updated successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while updating MIS Item: ' + error.message)
      }
      return apiError('Unknown error while updating MIS Item')
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number | number[]
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await MisItemService.delete(id)
      if (!result) {
        return apiError('MIS Item(s) not found or could not be deleted')
      }
      return apiSuccess(result, 'MIS Item(s) deleted successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while deleting MIS Item: ' + error.message)
      }
      return apiError('Unknown error while deleting MIS Item')
    }
  }

  //@ts-ignore event not used
  async list(): Promise<successResponse<Mis_Item_Record[]> | errorResponse> {
    try {
      const result = await MisItemService.list()
      return apiSuccess(result, 'MIS Item(s) fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching MIS Item(s): ' + error.message)
      }
      return apiError('Unknown error while fetching MIS Item(s)')
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Mis_Item_Read | null> | errorResponse> {
    try {
      const result = await MisItemService.get(id)
      if (!result) {
        return apiError('MIS Item not found')
      }
      return apiSuccess(result, 'MIS Item fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching MIS Item: ' + error.message)
      }
      return apiError('Unknown error while fetching MIS Item')
    }
  }
}

export default new MisItemController()
