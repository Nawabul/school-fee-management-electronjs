import AdmissionService from '@main/service/AdmissionService'
import PaymentService from '@main/service/PaymentService'
import StudentService from '@main/service/StudentService'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { Transaction } from '@type/interfaces/db'
import { apiError, apiSuccess, errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'

class AddmissionController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Admission_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result = AdmissionService.db.transaction((tx: Transaction) => {
        const needPaid = data.amount
        // adjust payment
        const havePaid = PaymentService.adjustUsed(needPaid, 'admission', tx)

        const input = {
          ...data,
          paid: havePaid
        }
        // adjust Student amount
        StudentService.decrementBalance(tx, data.student_id, needPaid)

        // class update
        StudentService.class_update(data.student_id, data.class_id, tx)
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
