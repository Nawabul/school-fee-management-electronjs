import { Payment_Read, Payment_Record, Payment_Write } from '../../types/interfaces/payment'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import PaymentService from '../service/PaymentService'
import { Transaction } from '@type/interfaces/db'
import MisChargeService from '@main/service/MisChargeService'
import StudentService from '@main/service/StudentService'

class PaymentController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Payment_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      let remain = data.amount

      const result = PaymentService.db.transaction((tx: Transaction): number => {
        // adjust admission

        // adjust monthly

        // adjust mis charge
        const misCharge = MisChargeService.adjustPaid(remain, tx)
        remain -= misCharge

        const used = {
          admission: 0,
          monthly: 0,
          mis_charge: misCharge
        }
        const input = {
          ...data,
          ...used,
          used: data.amount - remain
        }

        // create payment record
        const paymentRecord = PaymentService.create(input, tx)

        // adjust student current amount
        StudentService.incrementBalance(tx, data.student_id, data.amount)
        console.log(paymentRecord)
        return paymentRecord
      })
      console.log(result, 'completed')
      return apiSuccess(result, 'Payment created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating payment: ' + error.message)
      }
      return apiError('Unknown error while creating payment')
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Payment_Write
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await PaymentService.update(id, data)
      if (!result) {
        return apiError('Payment not found or no changes made')
      }
      return apiSuccess(result, 'Payment updated successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while updating payment: ' + error.message)
      }
      return apiError('Unknown error while updating payment')
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await PaymentService.delete(id)
      if (!result) {
        return apiError('Payment not found or could not be deleted')
      }
      return apiSuccess(result, 'Payment deleted successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while deleting payment: ' + error.message)
      }
      return apiError('Unknown error while deleting payment')
    }
  }

  //@ts-ignore event not used
  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Payment_Record[]> | errorResponse> {
    try {
      const result = await PaymentService.list(studentId)
      return apiSuccess(result, 'Payments fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching payments: ' + error.message)
      }
      return apiError('Unknown error while fetching payments')
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Payment_Read> | errorResponse> {
    try {
      const result = await PaymentService.get(id)
      if (!result) {
        return apiError('Payment not found')
      }
      return apiSuccess(result, 'Payment fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching payment: ' + error.message)
      }
      return apiError('Unknown error while fetching payment')
    }
  }
}

export default new PaymentController()
