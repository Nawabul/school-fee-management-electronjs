import {
  Payment_Read,
  Payment_Record,
  Payment_Type,
  Payment_Write
} from '../../types/interfaces/payment'
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
    data: Payment_Write,
    type: Payment_Type = 'admission'
  ): Promise<successResponse<number> | errorResponse> {
    try {
      let remain = data.amount
      const studentId = data.student_id
      const result = PaymentService.db.transaction((tx: Transaction): number => {
        let admission = 0
        let misCharge = 0
        let monthly = 0
        // adjust admission
        const services = {
          admission: () => {
            admission = AdmissionService.adjustPaid(studentId, remain, tx)
            remain -= admission
          },
          mis_charge: () => {
            misCharge = MisChargeService.adjustPaid(studentId, remain, tx)
            remain -= misCharge
          },
          monthly: () => {
            monthly = MonthlyFeeService.adjustPaid(studentId, remain, tx)
            remain -= monthly
          }
        }

        const serviceName: Payment_Type[] = ['admission', 'monthly', 'mis_charge']

        const index = serviceName.indexOf(type)
        if (index == -1) {
          throw new Error('Send a valid type')
        }

        const firstService = services[serviceName[index]]
        firstService()
        // remove that element from array
        serviceName.splice(index, 1)
        // call the rest of the services
        for (const service of serviceName) {
          services[service]()
        }
        // adjust monthly

        // adjust mis charge

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
        let newAdmission = paymentRecord.admission
        let newMonthly = paymentRecord.monthly
        let newMisCharge = paymentRecord.mis_charge
        let newUsed = paymentRecord.used
        const studentId = paymentRecord.student_id

        // Refund adjustment if payment amount is reduced
        if (balanceDiff < 0) {
          const remainingRefund = Math.abs(balanceDiff)
          const surplus = paymentRecord.amount - paymentRecord.used

          // refund more than surplus
          if (remainingRefund > surplus) {
            let refund = remainingRefund - surplus
            let needRefund = refund
            const student = StudentService.get(paymentRecord.student_id)
            if (!student) {
              throw new Error('Student not found')
            }
            const unused = student.current_balance
            // let remainingAdjust = 0
            if (unused < 0) {
              // remainingAdjust = 0
            } else if (unused < refund) {
              needRefund = refund - unused
              // remainingAdjust = unused
            } else {
              needRefund = 0
              // remainingAdjust = refund
            }
            // mis charge
            const refundMis = Math.min(needRefund, paymentRecord.mis_charge)
            MisChargeService.adjustPaid(studentId, -refundMis, tx)
            needRefund -= refundMis
            let actualAdjustMis = 0
            if (refund > 0) {
              const actualRefudMis = Math.min(refund, paymentRecord.mis_charge)
              newMisCharge -= actualRefudMis
              newUsed -= actualRefudMis
              refund -= actualRefudMis
              actualAdjustMis = actualRefudMis - refundMis
            }

            // monthly
            const refundMonthly = Math.min(needRefund, paymentRecord.monthly)
            MonthlyFeeService.adjustPaid(studentId, -refundMonthly, tx)
            needRefund -= refundMonthly
            let actualAdjustMonthly = 0
            if (refund > 0) {
              const actualRefundMonthly = Math.min(refund, paymentRecord.monthly)
              newMonthly -= actualRefundMonthly
              newUsed -= actualRefundMonthly
              refund -= actualRefundMonthly
              actualAdjustMonthly = actualRefundMonthly - refundMonthly
            }

            // admission
            const refundAdmission = Math.min(needRefund, paymentRecord.admission)
            AdmissionService.adjustPaid(studentId, -refundAdmission, tx)
            needRefund -= refundAdmission
            let actualAdjustAdmission = 0
            if (refund > 0) {
              const actualRefundAdmission = Math.min(refund, paymentRecord.admission)
              newMonthly -= actualRefundAdmission
              newUsed -= actualRefundAdmission
              refund -= actualRefundAdmission
              actualAdjustAdmission = actualRefundAdmission - refundAdmission
            }

            // update payment
            const updatedData = {
              ...data,
              mis_charge: newMisCharge,
              monthly: newMonthly,
              admission: newAdmission,
              used: newUsed
            }
            const paymentUpdate = PaymentService.update(id, updatedData, tx)

            // adjust amount
            PaymentService.adjustUsed(studentId, actualAdjustMis, 'mis_charge', tx)
            PaymentService.adjustUsed(studentId, actualAdjustMonthly, 'monthly', tx)
            PaymentService.adjustUsed(studentId, actualAdjustAdmission, 'admission', tx)

            // update student amount
            StudentService.incrementBalance(tx, paymentRecord.student_id, balanceDiff)
            return paymentUpdate
          }
        }
        // Allocation if payment is increased
        if (balanceDiff > 0) {
          let remainingAdd = balanceDiff

          const addAdmission = AdmissionService.adjustPaid(studentId, remainingAdd, tx)
          remainingAdd -= addAdmission
          newAdmission += addAdmission
          newUsed += addAdmission

          const addMonthly = MonthlyFeeService.adjustPaid(studentId, remainingAdd, tx)
          remainingAdd -= addMonthly
          newMonthly += addMonthly
          newUsed += addMonthly

          const addMis = MisChargeService.adjustPaid(studentId, remainingAdd, tx)
          remainingAdd -= addMis
          newMisCharge += addMis
          newUsed += addMis
        }

        const updatedData = {
          ...data,
          mis_charge: newMisCharge,
          monthly: newMonthly,
          admission: newAdmission,
          used: newUsed
        }

        // update payment
        const paymentUpdate = PaymentService.update(id, updatedData, tx)
        // update student balance
        StudentService.incrementBalance(tx, paymentRecord.student_id, balanceDiff)
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
      const studentId = paymentRecord.student_id
      const result = PaymentService.db.transaction((tx: Transaction): boolean => {
        const used = paymentRecord.used
        const paymentDelete = PaymentService.delete(id, tx)

        if (used != 0) {
          const student = StudentService.get(paymentRecord.student_id)
          if (!student) {
            throw new Error('Student not found')
          }
          const unused = student.current_balance
          let adjustAmount = 0
          if (unused < 0) {
            adjustAmount = 0
          } else if (unused < used) {
            adjustAmount = unused
          } else {
            adjustAmount = used
          }
          // adjust monthly
          const adjustAdmission = Math.min(adjustAmount, paymentRecord.admission)
          const refundAdmission = paymentRecord.admission - adjustAdmission
          AdmissionService.adjustPaid(studentId, -refundAdmission, tx)
          PaymentService.adjustUsed(studentId, adjustAdmission, 'admission', tx)
          adjustAmount -= adjustAdmission

          // adjust monthly
          const adjustMonthly = Math.min(adjustAmount, paymentRecord.monthly)
          const refundMonthly = paymentRecord.monthly - adjustMonthly
          MonthlyFeeService.adjustPaid(studentId, -refundMonthly, tx)
          PaymentService.adjustUsed(studentId, adjustMonthly, 'monthly', tx)
          adjustAmount -= adjustMonthly

          // adjust mis charge
          const adjustMis = Math.min(adjustAmount, paymentRecord.mis_charge)
          const refundMis = paymentRecord.mis_charge - adjustMis
          MisChargeService.adjustPaid(studentId, -refundMis, tx)
          PaymentService.adjustUsed(studentId, adjustMis, 'mis_charge', tx)
          adjustAmount -= adjustMis

          // adjust student current amount
        }
        // update payment
        StudentService.decrementBalance(tx, paymentRecord.student_id, paymentRecord.amount)
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
