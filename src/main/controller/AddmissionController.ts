import db from '@main/db/db'
import AdmissionService from '@main/service/AdmissionService'
import StudentService from '@main/service/StudentService'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { apiError, apiSuccess, errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'

class AddmissionController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Admission_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      let id: number = 0
      db.transaction((tx) => {
        ;(async () => {
          const admissionId = await AdmissionService.create(data, tx)
          if (!admissionId) {
            throw new Error('Failed to create admission, no ID returned')
          }

          // update student classs
          const updateClass = await StudentService.class_update(data.student_id, data.class_id, tx)

          if (!updateClass) {
            throw new Error('Failed to update student class')
          }
          // decrement student balance
          StudentService.decrementBalance(tx, data.student_id, data.amount)
          id = admissionId
        })()
      })

      if (id === 0) {
        return apiError('Failed to create admission, no ID returned')
      }

      return apiSuccess(id, 'Admission created successfully')
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
