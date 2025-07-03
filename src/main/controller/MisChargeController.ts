import { IpcMainInvokeEvent } from 'electron'
import {
  Mis_Charge_Read,
  Mis_Charge_Record,
  Mis_Charge_Write
} from '../../types/interfaces/mis_charge'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import MisChargeService from '../service/MisChargeService'
import { Transaction } from '@type/interfaces/db'
import PaymentService from '@main/service/PaymentService'
import StudentService from '@main/service/StudentService'

class MisChargeController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Mis_Charge_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = MisChargeService.db.transaction((tx: Transaction) => {
        const needPaid = data.amount
        // adjust payment
        const havePaid = PaymentService.adjustUsed(needPaid, 'mis_charge', tx)

        const input = {
          ...data,
          paid: havePaid
        }
        // adjust Student amount
        StudentService.decrementBalance(tx, data.student_id, needPaid - havePaid)
        return MisChargeService.create(input, tx)
      })
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
      // fetch mis charge
      const misCharge = MisChargeService.get(id)
      if (!misCharge) {
        return apiError('MIS. Charge not found')
      }

      const result = MisChargeService.db.transaction((tx: Transaction) => {
        const amountChange = data.amount - misCharge.amount
        const input = {
          ...data,
          paid: misCharge.paid
        }
        const needPaid = data.amount - misCharge.paid
        if (needPaid != 0) {
          // adjust payment
          const havePaid = PaymentService.adjustUsed(needPaid, 'mis_charge', tx)

          input.paid = misCharge.paid + havePaid
          const downAmount = amountChange - havePaid
          // adjust Student amount
          StudentService.decrementBalance(tx, misCharge.student_id, downAmount)
        }

        // update mis charges
        return MisChargeService.update(id, input, tx)
      })
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
      // fetch mis charge
      const misCharge = MisChargeService.get(id)
      if (!misCharge) {
        return apiError('MIS. Charge not found')
      }

      const result = MisChargeService.db.transaction((tx: Transaction) => {
        const paid = misCharge.paid

        if (paid != 0) {
          // adjust payment
          PaymentService.adjustUsed(-paid, 'mis_charge', tx)
        }
        // up amount from student
        StudentService.incrementBalance(tx, misCharge.student_id, misCharge.amount - paid)
        return MisChargeService.delete(id, tx)
      })
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
  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Mis_Charge_Record[]> | errorResponse> {
    try {
      const result = await MisChargeService.list(studentId)
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
