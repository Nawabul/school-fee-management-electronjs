import AdmissionService from '@main/service/AdmissionService'
import PaymentService from '@main/service/PaymentService'
import StudentService from '@main/service/StudentService'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { Transaction } from '@type/interfaces/db'
import { apiError, apiSuccess, errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import MonthlyFeeController from './MonthlyFeeController'
import MonthlyFeeService from '@main/service/MonthlyFeeService'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import { format } from 'date-fns'

class AddmissionController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Admission_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = AdmissionService.db.transaction((tx: Transaction) => {
        const needPaid = data.amount
        const studentId = data.student_id
        const monthly = data.monthly
        console.log(data)
        // adjust payment
        const admisionPaid = PaymentService.adjustUsed(studentId, needPaid, 'admission', tx)

        const input = {
          ...data,
          paid: admisionPaid
        }

        // monthly
        const payment = PaymentService.unsed_list(studentId)
        const payable = payment.reduce((acc, payment) => acc + (payment.amount - payment.used), 0)
        const remain = payable > 0 ? payable : 0
        const today = format(new Date(), DB_DATE_FORMAT)
        // fetch student
        const student = StudentService.get(data.student_id)
        if (!student) {
          throw new Error('Student not found')
        }
        const last_fee = student.last_fee_date
        const fromDate = data.date
        const startDate = fromDate < last_fee ? last_fee : fromDate
        const month = MonthlyFeeController.countMonth(startDate, today)
        MonthlyFeeService.createBulkWithPayment(
          {
            student_id: studentId,
            class_id: data.class_id,
            from: startDate,
            count: month.count,
            fee: monthly,
            haveAmount: remain
          },
          tx
        )
        const monthUsed = month.count * monthly
        const totalCharge = data.amount + monthUsed
        // update student
        StudentService.last_fee_date_update(studentId, month.end, tx)
        // adjust Student amount
        StudentService.decrementBalance(tx, data.student_id, totalCharge)

        // class update
        StudentService.class_update(data.student_id, data.class_id, monthly, tx)
        return AdmissionService.create(input, tx)
      })
      return apiSuccess(result, 'Admission created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating admission: ' + error.message)
      }
      return apiError('Error while creating admission')
    }
  }

  async list(
    _event: IpcMainInvokeEvent,
    studentId: number
  ): Promise<successResponse<Admission_Record[]> | errorResponse> {
    try {
      const result = await AdmissionService.list(studentId)

      return apiSuccess(result, 'Student Admission fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching Admission List: ' + error.message)
      }
      return apiError('Unknown error while fetching Admisssion List')
    }
  }
}

export default new AddmissionController()
