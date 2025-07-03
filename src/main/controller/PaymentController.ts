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
        return paymentRecord
      })
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
      // fetch payment record
      const paymentRecord = PaymentService.get(id)
      if (!paymentRecord) {
        return apiError('Payment not found')
      }
      const result = PaymentService.db.transaction((tx: Transaction): boolean => {
        const balanceDiff = data.amount - paymentRecord.amount
        const havePaid = data.amount - paymentRecord.used
        let usedNow = 0

        let inputused = {
          admission: paymentRecord.admission,
          monthly: paymentRecord.monthly,
          mis_charge: paymentRecord.mis_charge
        }
        let input = {
          ...data,
          ...inputused,
          used: paymentRecord.used
        }
        let remain = havePaid
        if (balanceDiff != 0) {
          // adjust admission

          // adjust monthly

          // adjust mis charge
          const misCharge = MisChargeService.adjustPaid(remain, tx)

          remain -= misCharge
          usedNow += misCharge

          inputused = {
            admission: 0,
            monthly: 0,
            mis_charge: paymentRecord.mis_charge + misCharge
          }
          input = {
            ...data,
            ...inputused,
            used: paymentRecord.used + usedNow
          }

          // adjust student current amount
          console.log('diff', balanceDiff)
          StudentService.incrementBalance(tx, paymentRecord.student_id, balanceDiff)
        }
        // update payment
        const paymentUpdate = PaymentService.update(id, input, tx)
        return paymentUpdate
      })
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
      // fetch payment record
      const paymentRecord = PaymentService.get(id)
      if (!paymentRecord) {
        return apiError('Payment not found')
      }
      const result = PaymentService.db.transaction((tx: Transaction): boolean => {
        const used = paymentRecord.used

        if (used != 0) {
          // adjust admission

          // adjust monthly

          // adjust mis charge
          MisChargeService.adjustPaid(-paymentRecord.mis_charge, tx)

          // adjust student current amount
        }
        // update payment
        StudentService.decrementBalance(tx, paymentRecord.student_id, paymentRecord.amount)
        const paymentDelete = PaymentService.delete(id, tx)
        return paymentDelete
      })
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
