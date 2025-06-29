import { Student_Get, Student_Record, Student_Write } from '../../types/interfaces/student'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import StudentService from '../service/StudentService'
import MonthlyFeeController from './MonthlyFeeController'
import AdmissionService from '@main/service/AdmissionService'
import ClassService from '@main/service/ClassService'
import { Admission_Write } from '@type/interfaces/admission'
import { format } from 'date-fns'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
class StudentController {
  async create(
    _event: IpcMainInvokeEvent,
    data: Student_Write
  ): Promise<successResponse<number> | errorResponse> {
    try {
      let id: number = 0

      const result = await StudentService.create(null, data)

      id = result.id
      const last_date = result.last_date

      const req = {
        student_id: id,
        class_id: data.class_id,
        from: last_date,
        to: new Date().toISOString()
      }
      // add fee
      const fee = await MonthlyFeeController.create(req, null)
      //@ts-ignore data variable
      if (!fee.success || !fee?.data) {
        throw new Error('Error while creating monthly fee')
      }

      // fetch class
      const fetchClass = await ClassService.list(data.class_id)

      if (!fetchClass) {
        throw new Error('Class not found')
      }
      // structure data for admission
      const admissionData: Admission_Write = {
        student_id: id,
        class_id: data.class_id,
        amount: fetchClass[0].admission_charge,
        date: format(new Date(), DB_DATE_FORMAT)
      }

      // create addmission record
      const admission = await AdmissionService.create(admissionData)
      if (!admission) {
        throw new Error('Error while creating admission record')
      }

      // decrement student amount
      StudentService.decrementBalance(StudentService.db, id, fetchClass[0].admission_charge)
      return apiSuccess(id, 'Student created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating student: ' + error.message)
      }
      return apiError('Error while creating student')
    }
  }
  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Student_Write
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      // Validate that the student exists before updating
      const student = await StudentService.get(id)
      if (!student) {
        return apiError('Student not found')
      }

      const result: boolean = await StudentService.update(null, id, data)
      if (!result) {
        return apiError('Student not found or no changes made')
      }
      return apiSuccess(result, 'Student updated successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating student: ' + error.message)
      }
      return apiError('Error while creating student')
    }
  }
  async transfer(
    _event: IpcMainInvokeEvent,
    id: number,
    data: { date: string }
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      // Validate that the student exists before updating
      const student = await StudentService.get(id)
      if (!student) {
        return apiError('Student not found')
      }

      const result: boolean = await StudentService.transfer(id, data.date)

      return apiSuccess(result, 'Student transfer successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating student: ' + error.message)
      }
      return apiError('Error while creating student')
    }
  }
  async continueStudy(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      // Validate that the student exists before updating
      const student = await StudentService.get(id)
      if (!student) {
        return apiError('Student not found')
      }

      const result: boolean = await StudentService.continueStudy(id)

      return apiSuccess(result, 'Student transfer successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating student: ' + error.message)
      }
      return apiError('Error while creating student')
    }
  }
  async delete(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      // Validate that the student exists before deleting
      const student = await StudentService.get(id)
      if (!student) {
        return apiError('Student not found')
      }

      const result: boolean = await StudentService.delete(id)
      if (!result) {
        return apiError('Student not found or no changes made')
      }
      return apiSuccess(result, 'Student deleted successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while deleting student: ', error)
      }
      return apiError('Error while deleting student')
    }
  }
  //@ts-ignore event name not used
  async list(): Promise<successResponse<Student_Record[]> | errorResponse> {
    try {
      const result = await StudentService.list()

      return apiSuccess(result, 'Student Fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching Student: ' + error.message)
      }
      return apiError('Error while fetching Student')
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Student_Get> | errorResponse> {
    try {
      const result = await StudentService.get(id)

      if (!result) {
        return apiError('Student not found')
      }
      return apiSuccess(result, 'Student Fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching student: ' + error.message)
      }
      return apiError('Error while fetching student')
    }
  }
}

export default new StudentController()
