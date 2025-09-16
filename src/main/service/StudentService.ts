// src/service/StudentService.ts
import StudentRepository from '@main/repository/StudentRepository'
import {
  Student_Write,
  Student_Get,
  Student_Record,
  Student_Details,
  StudentListLastFeeMonthAgo
} from '@type/interfaces/student'
import { format, set, subYears } from 'date-fns'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import SessionService from './SessionService'
import { BaseController } from '@main/controller/BaseController'
import AdmissionService from '@main/service/AdmissionService'
import { Transaction } from '@type/interfaces/db'
import db from '@main/db/db'
import MonthlyFeeService from './MonthlyFeeService'
import StudnetNotFoundException from '@main/exception.ts/StudentNotFoundException'
import MisChargeRepository from '@main/repository/MisChargeRepository'
import PaymentRepository from '@main/repository/PaymentRepository'
import { StudentTransferSchema } from '@main/utils/schema/student'
import AlreadyExistException from '@main/exception.ts/AlreadyExistException'

interface StudentCreate extends Student_Write {
  admission_charge: number
}

class StudentService extends BaseController {
  private repo: StudentRepository
  private admissionService: typeof AdmissionService
  private monthlyService: typeof MonthlyFeeService
  private misChargeRepo: MisChargeRepository
  private paymentRepo: PaymentRepository

  constructor() {
    super()
    this.repo = new StudentRepository()
    this.admissionService = AdmissionService
    this.monthlyService = MonthlyFeeService

    this.misChargeRepo = new MisChargeRepository()

    this.paymentRepo = new PaymentRepository()
  }

  async create(data: StudentCreate): Promise<number> {
    try {
      const result = db.transaction((tx: Transaction) => {
        const { admission_charge, ...body } = data
        const isUnique = this.repo.regNumberUnique(data.reg_number)

        if (!isUnique) {
          throw new AlreadyExistException('Reg. Already exist')
        }
        // 1. Create student
        const student = this.createStudent(body, tx)
        const { id: studentId, class_id: classId, monthly: fee } = student

        const today = format(new Date(), DB_DATE_FORMAT)
        const activeUntil = student.active_until || today
        const lastFeeDate = student.last_fee_date
        const admissionDate = student.admission_date

        // 2. Create admission record
        this.admissionService.create(
          {
            amount: admission_charge,
            class_id: classId,
            date: admissionDate < lastFeeDate ? lastFeeDate : admissionDate,
            paid: 0,
            student_id: studentId,
            monthly: fee
          },
          tx
        )

        // 3. Create monthly fee records
        const endDate = activeUntil < today ? activeUntil : today
        const { count: countMonth, end: endLastFeeDate } = this.monthlyService.countMonth(
          lastFeeDate,
          endDate
        )

        this.monthlyService.createByRange(
          {
            studentId,
            classId,
            fee,
            count: countMonth,
            haveAmount: 0,
            from: lastFeeDate
          },
          tx
        )

        // 4. Update balance
        const total = fee * countMonth + admission_charge
        this.repo.decrementBalance(studentId, total, tx)

        // 5. Update last fee date
        this.repo.lastFeeUpdate(studentId, endLastFeeDate, tx)
        return student
      })

      return result.id
    } catch (error) {
      throw super.processError(error)
    }
  }

  async update(id: number, data: Partial<Student_Write>): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new StudnetNotFoundException('Student not found')

    const isUnique = this.repo.regNumberUnique(data.reg_number!, id)

    if (!isUnique) {
      throw new AlreadyExistException('Reg. Already exist')
    }

    const dbData = {
      ...data,
      current_balance: student.current_balance,
      is_whatsapp: data.is_whatsapp !== undefined ? (data.is_whatsapp ? 1 : 0) : undefined
    }

    // remove undefined fields
    Object.keys(dbData).forEach((k) => dbData[k] === undefined && delete dbData[k])

    const prevAmount = student.initial_balance
    const currentAmount = data.initial_balance ?? prevAmount
    const diff = currentAmount - prevAmount

    if (diff != 0) {
      dbData.current_balance = student.current_balance + diff
    }
    const updated = this.repo.update(id, dbData)
    return !!updated
  }

  async transfer(id: number, data: StudentTransferSchema): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new StudnetNotFoundException('Student not found')

    const result = db.transaction((tx: Transaction) => {
      const transfer = this.repo.update(
        id,
        {
          transfer_date: data.date
        },
        tx
      )

      if (data.month_charge) {
        this.monthlyService.processCreate(
          {
            studentId: student.id,
            classId: student.class_id,
            endIncluded: true,
            monthly: student.monthly,
            start: student.last_fee_date
          },
          tx
        )
      }

      return transfer
    })

    return result.changes > 0
  }
  async continue(id: number): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new StudnetNotFoundException('Student not found')

    const result = db.transaction((tx: Transaction) => {
      const transfer = this.repo.update(
        id,
        {
          transfer_date: null
        },
        tx
      )

      return transfer
    })

    return result.changes > 0
  }

  active_student_active_until_update(endDate: string, tx: Transaction): boolean {
    return this.repo.active_student_active_until_update(endDate, tx)
  }

  async delete(id: number): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new StudnetNotFoundException()

    try {
      const result = db.transaction((tx: Transaction) => {
        // delete mis
        this.misChargeRepo.deleteAllOfStudent(id, tx)
        // delete monthly
        this.monthlyService.deleteAllOfStudent(id, tx)
        // delete admission
        this.admissionService.deleteAllOfStudent(id, tx)

        // delete all payments
        this.paymentRepo.deleteAllOfStudent(id, tx)
        // delete student
        return this.repo.delete(id, tx)
      })

      return result.changes > 0
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  async list(): Promise<Student_Record[]> {
    return this.repo.listOfAllStudent()
  }

  public listOfLastFeeMonthAgo(): StudentListLastFeeMonthAgo[] {
    return this.repo.listOfLastFeeMonthAgo()
  }

  get(id: number): Student_Get {
    try {
      const student = this.repo.findById(id)

      if (!student) {
        throw new StudnetNotFoundException()
      }

      return {
        ...student,
        is_whatsapp: !!student.is_whatsapp
      }
    } catch (error) {
      throw super.processError(error)
    }
  }

  public details(studnetId: number): Student_Details {
    const result = this.repo.details(studnetId)

    if (!result) {
      throw new StudnetNotFoundException()
    }

    return result
  }

  // private helper
  private createStudent(
    data: Student_Write,
    tx: Transaction = db
  ): ReturnType<StudentRepository['create']> {
    const admissionMonth = set(new Date(data.admission_date), { date: 1 })
    let lastFeeDate = format(admissionMonth, DB_DATE_FORMAT)

    const activeUntil = SessionService.endDate()

    // session start = first day of same month last year
    const sessionStart = format(
      set(subYears(new Date(activeUntil), 1), { date: 1 }),
      DB_DATE_FORMAT
    )

    // Ensure lastFeeDate is not before sessionStart
    if (lastFeeDate < sessionStart) {
      lastFeeDate = sessionStart
    }

    const row = {
      ...data,
      is_whatsapp: data.is_whatsapp ? 1 : 0,
      last_fee_date: lastFeeDate,
      active_until: activeUntil,
      initial_balance: data.initial_balance ?? 0,
      current_balance: data.initial_balance ?? 0
    }

    return this.repo.create(row, tx)
  }
}

export default new StudentService()
