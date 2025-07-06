import { Student_Get, Student_Record, Student_Write } from '../../types/interfaces/student'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import StudentService from '../service/StudentService'
import MonthlyFeeController from './MonthlyFeeController'
import AdmissionService from '@main/service/AdmissionService'
import { format } from 'date-fns'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import { Transaction } from '@type/interfaces/db'
import PaymentService from '@main/service/PaymentService'
import MonthlyFeeService from '@main/service/MonthlyFeeService'
import ClassService from '@main/service/ClassService'

interface studentCreate extends Student_Write {
  admission_charge: number
}
class StudentController {
  async create(
    _event: IpcMainInvokeEvent,
    data: studentCreate
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const { admission_charge, ...body } = data
      const id = StudentService.db.transaction((tx: Transaction) => {
        const student = StudentService.create(body, tx)
        const last_date = student.last_date
        const today = format(new Date(), DB_DATE_FORMAT)
        const active_until = student.active_until || today
        const studentId = student.id
        const payment = PaymentService.unsed_list(studentId)
        const payable = payment.reduce((acc, payment) => acc + (payment.amount - payment.used), 0)
        let remain = payable
        let used = 0
        let paid = 0
        if (admission_charge < remain) {
          remain = remain - admission_charge
          paid = admission_charge
        } else if (remain > 0) {
          paid = remain
          remain = 0
        } else {
          paid = 0
          remain = 0
        }
        // admissin
        AdmissionService.create({
          amount: admission_charge,
          class_id: data.class_id,
          date: data.admission_date,
          paid,
          student_id: studentId
        })
        // adjust payment
        PaymentService.adjustUsed(studentId, paid, 'admission', tx)
        used += admission_charge
        const endDate = active_until < today ? active_until : today
        const month = MonthlyFeeController.countMonth(last_date, endDate)
        const fetchClass = ClassService.get(data.class_id)
        if (!fetchClass) {
          throw new Error('Class Not found')
        }
        const fee = fetchClass.amount
        // monthly fee
        const montly = MonthlyFeeService.createBulk(
          {
            student_id: studentId,
            class_id: data.class_id,
            from: last_date,
            count: month.count,
            fee,
            haveAmount: remain
          },
          tx
        )
        used += month.count * fee
        // payment
        PaymentService.adjustUsed(studentId, montly, 'monthly', tx)

        // update student
        StudentService.last_fee_date_update(studentId, month.end, tx)
        // update student amount
        StudentService.decrementBalance(tx, studentId, used)

        return student.id
      })

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
