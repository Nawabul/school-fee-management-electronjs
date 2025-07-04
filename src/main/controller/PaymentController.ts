import { Payment_Read, Payment_Record, Payment_Write } from '../../types/interfaces/payment'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import PaymentService from '../service/PaymentService'
import { Transaction } from '@type/interfaces/db'
import MisChargeService from '@main/service/MisChargeService'
import StudentService from '@main/service/StudentService'
import MonthlyFeeService from '@main/service/MonthlyFeeService'
import AdmissionService from '@main/service/AdmissionService'

class PaymentController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Payment_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      let remain = data.amount

      const result = PaymentService.db.transaction((tx: Transaction): number => {
        // adjust admission
        const admission = AdmissionService.adjustPaid(remain, tx)
        remain -= admission
        // adjust monthly
        const monthly = MonthlyFeeService.adjustPaid(remain, tx)

        remain -= monthly
        // adjust mis charge
        const misCharge = MisChargeService.adjustPaid(remain, tx)
        remain -= misCharge

        const used = {
          admission: admission,
          monthly: monthly,
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
        const havePaid = balanceDiff
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
          let misCharge = paymentRecord.mis_charge
          let monthly = paymentRecord.monthly
          let admission = paymentRecord.admission
          if (balanceDiff < 0) {
            // adjust mis charge
            if (Math.abs(remain) < paymentRecord.mis_charge) {
              misCharge = MisChargeService.adjustPaid(remain, tx)
            } else {
              misCharge = MisChargeService.adjustPaid(-paymentRecord.mis_charge, tx)
            }

            remain -= misCharge
            usedNow += misCharge

            // adjust monthly
            if (Math.abs(remain) < paymentRecord.monthly) {
              monthly = MonthlyFeeService.adjustPaid(remain, tx)
            } else {
              monthly = MonthlyFeeService.adjustPaid(-paymentRecord.monthly, tx)
            }

            remain -= monthly
            usedNow += monthly
            // adjust admission

            // adjust monthly
            if (Math.abs(remain) < paymentRecord.admission) {
              admission = AdmissionService.adjustPaid(remain, tx)
            } else {
              admission = AdmissionService.adjustPaid(-paymentRecord.admission, tx)
            }

            remain -= admission
            usedNow += admission
          } else {
            admission = AdmissionService.adjustPaid(remain, tx)
            remain -= admission
            usedNow += admission
            monthly = MonthlyFeeService.adjustPaid(remain, tx)
            remain -= monthly
            usedNow += monthly
            misCharge = MisChargeService.adjustPaid(remain, tx)
            remain -= misCharge
            usedNow += misCharge
          }
          // adjust admission

          // adjust monthly

          // adjust mis charge

          inputused = {
            admission: paymentRecord.admission + admission,
            monthly: paymentRecord.monthly + monthly,
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
          AdmissionService.adjustPaid(-paymentRecord.admission, tx)
          // adjust monthly
          MonthlyFeeService.adjustPaid(-paymentRecord.monthly, tx)
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
