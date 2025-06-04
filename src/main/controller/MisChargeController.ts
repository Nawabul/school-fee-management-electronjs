import { IpcMainInvokeEvent } from 'electron'
import {
  Mis_Charge_Read,
  Mis_Charge_Record,
  Mis_Charge_Write
} from '../../types/interfaces/mis_charge'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import MisChargeService from '../service/MisChargeService'

class MisChargeController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Mis_Charge_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = await MisChargeService.create(data)
      return apiSuccess(result, 'MIS Charge created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating MIS Charge: ' + error.message)
      }
      return apiError('Unknown error while creating MIS Charge')
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Mis_Charge_Write
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await MisChargeService.update(id, data)
      if (!result) {
        return apiError('MIS Charge not found or no changes made')
      }
      return apiSuccess(result, 'MIS Charge updated successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while updating MIS Charge: ' + error.message)
      }
      return apiError('Unknown error while updating MIS Charge')
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await MisChargeService.delete(id)
      if (!result) {
        return apiError('MIS Charge not found or could not be deleted')
      }
      return apiSuccess(result, 'MIS Charge deleted successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while deleting MIS Charge: ' + error.message)
      }
      return apiError('Unknown error while deleting MIS Charge')
    }
  }

  //@ts-ignore event not used
  async list(): Promise<successResponse<Mis_Charge_Record[]> | errorResponse> {
    try {
      const result = await MisChargeService.list()
      return apiSuccess(result, 'MIS Charges fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching MIS Charges: ' + error.message)
      }
      return apiError('Unknown error while fetching MIS Charges')
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Mis_Charge_Read> | errorResponse> {
    try {
      const result = await MisChargeService.get(id)
      if (!result) {
        return apiError('MIS Charge not found')
      }
      return apiSuccess(result, 'MIS Charge fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching MIS Charge: ' + error.message)
      }
      return apiError('Unknown error while fetching MIS Charge')
    }
  }
}

export default new MisChargeController()
