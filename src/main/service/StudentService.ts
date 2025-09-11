// src/service/StudentService.ts
import StudentRepository from '@main/repository/StudentRepository'
import { Student_Write, Student_Get, Student_Record } from '@type/interfaces/student'
import { format, set } from 'date-fns'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import SessionService from './SessionService'
import { BaseController } from '@main/controller/BaseController'
import { Transaction } from '@type/interfaces/db'
import db from '@main/db/db'
import { errorResponse } from '@type/utils/apiReturn'

class StudentService extends BaseController {
  private repo: StudentRepository

  constructor() {
    super()
    this.repo = new StudentRepository()
  }

  async create(data: Student_Write): Promise<number> {
    try {
      const result = db.transaction((tx: Transaction) => {
        const student = this.createStudent(data)
        return student
      })


      return result.id
    } catch (error) {
      throw super.processError(error)
    }
  }

  async update(id: number, data: Partial<Student_Write>): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new Error('Student not found')

    const dbData = {
      ...data,
      is_whatsapp: data.is_whatsapp !== undefined ? (data.is_whatsapp ? 1 : 0) : undefined
    }

    Object.keys(dbData).forEach((k) => dbData[k] === undefined && delete dbData[k])

    const updated = this.repo.update(id, dbData)
    return !!updated
  }

  async delete(id: number): Promise<boolean> {
    const student = this.repo.findById(id)
    if (!student) throw new Error('Student not found')

    // Delete related tables first (payments, monthly_fee, etc.)
    // You can create separate repositories for them or handle in service
    try {
      // Example: transaction with Drizzle's `db.transaction` if needed
      return !!this.repo.delete(id)
    } catch (error: unknown) {
      if ((error as any).code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        throw new Error('Cannot delete student, related records exist')
      }
      throw error
    }
  }

  async list(): Promise<Student_Record[]> {
    // For complex join queries, you can either:
    // 1. Add custom methods in repository, or
    // 2. Use service directly with db
    return this.repo.findAll() as unknown as Student_Record[]
  }

  get(id: number): Student_Get | null {
    return this.repo.findById(id) as Student_Get | null
  }

  // private function
  createStudent(
    data: Student_Write,
    tx: Transaction = db
  ): ReturnType<StudentRepository['create']> {
    // Prepare data
    const date1 = set(new Date(data.admission_date), { date: 1 })
    const fee_date = format(date1, DB_DATE_FORMAT)
    const active_until = SessionService.endDate()

    const row = {
      ...data,
      is_whatsapp: data.is_whatsapp ? 1 : 0,
      last_fee_date: fee_date,
      active_until,
      initial_balance: 0,
      current_balance: 0
    }

    const student = this.repo.create(row, tx)
    return student
  }
}

export default new StudentService()
