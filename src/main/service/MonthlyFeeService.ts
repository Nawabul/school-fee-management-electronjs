import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import db from '../db/db'
import { monthly_fee } from '../db/schema/monthly_fee'
import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm'
import { Monthly_Fee_Record, Monthly_Fee_Write } from '../../types/interfaces/monthly_fee'
import { students } from '../db/schema/student'
import { classes } from '../db/schema/class'

class MonthlyFeeService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }

  async create(tx: typeof this.db | null = null, data: Monthly_Fee_Write[]): Promise<boolean> {
    try {
      const dbInstance = tx || this.db
      const result = await dbInstance.insert(monthly_fee).values(data)
      if (!result.changes) {

        throw new Error('Failed to create monthly fees, no rows affected')
      }
      return result.changes > 0
    } catch (error) {
      if (error instanceof Error) {

        throw new Error('Error while listing monthly fees: ' + error.message)
      } else {
        throw new Error('Unknown error while listing monthly fees')
      }
    }
  }
  async delete(tx: typeof this.db | null = null, id: number | number[]): Promise<number> {
    try {
      const dbInstance = tx || this.db
      const result = dbInstance
        .delete(monthly_fee)
        .where(inArray(monthly_fee.id, Array.isArray(id) ? id : [id]))
        .run()

      return result.changes
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while deleting monthly fees: ' + error.message)
      } else {
        throw new Error('Unknown error while deleting monthly fees')
      }
    }
  }

  async list(studentId: number): Promise<Monthly_Fee_Record[]> {
    try {
      const result = this.db
        .select({
          id: monthly_fee.id,
          date: monthly_fee.date,
          amount: monthly_fee.amount,
          class_name: classes.name,
          student_name: students.student_name
        })
        .from(monthly_fee)
        .innerJoin(classes, eq(monthly_fee.class_id, classes.id))
        .innerJoin(students, eq(monthly_fee.student_id, students.id))
        .where(eq(monthly_fee.student_id, studentId))
        .orderBy(desc(monthly_fee.date))
        .all()

      return result
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while listing monthly fees: ' + error.message)
      } else {
        throw new Error('Unknown error while listing monthly fees')
      }
    }
  }

  async listByDateRange(
    studentId: number,
    from: string,
    to: string
  ): Promise<Partial<Monthly_Fee_Record>[]> {
    try {
      const conditions = [
        eq(monthly_fee.student_id, studentId),
        gte(monthly_fee.date, from),
        lte(monthly_fee.date, to)
      ]

      const result = this.db
        .select({
          id: monthly_fee.id,
          date: monthly_fee.date,
          amount: monthly_fee.amount,
          class_name: classes.name,
          student_name: students.student_name
        })
        .from(monthly_fee)
        .where(and(...conditions))
        .orderBy(monthly_fee.date)
        .all()

      return result
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while listing monthly fees: ' + error.message)
      } else {
        throw new Error('Unknown error while listing monthly fees')
      }
    }
  }
}

export default new MonthlyFeeService()
