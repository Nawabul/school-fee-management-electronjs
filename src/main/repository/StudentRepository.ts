// src/repositories/ClassRepository.ts
import { Transaction } from '@type/interfaces/db'
import BaseRepository from './BaseRepository'
import { students } from '@main/db/schema/student' // drizzle table schema
import { and, eq, not, sql } from 'drizzle-orm'
import { RunResult } from 'better-sqlite3'
import {
  Student_Details,
  Student_Record,
  StudentListLastFeeMonthAgo
} from '@type/interfaces/student'
import { classes } from '@main/db/schema/class'
import { format } from 'date-fns'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'

class StudentRepository extends BaseRepository<typeof students> {
  protected model = students

  // last fee update

  public details(studentId: number): Student_Details | null {
    const result = this.db
      .select({
        id: students.id,
        reg_number: students.reg_number,
        student_name: students.student_name,
        father_name: students.father_name,
        mobile: students.mobile,
        address: students.address,
        admission_date: students.admission_date,
        transfer_date: students.transfer_date,
        is_whatsapp: students.is_whatsapp,
        class_name: classes.name,
        current_balance: students.current_balance,
        last_fee_date: students.last_fee_date,
        last_notification_date: students.last_notification_date
      })
      .from(students)
      .innerJoin(classes, eq(students.class_id, classes.id))
      .where(eq(students.id, studentId))
      .get()

    if (!result) {
      return null
    }

    return {
      ...result,
      is_whatsapp: result.is_whatsapp === 1, // Convert 1/0 to boolean
      transfer_date: result.transfer_date || null // Ensure transfer_date is null if not set
    }
  }

  public lastFeeUpdate(studentId: number, lastDate: string, tx: Transaction): boolean {
    const result = tx
      .update(this.model)
      .set({
        last_fee_date: lastDate
      })
      .where(eq(this.model.id, studentId))
      .run()

    return result.changes > 0
  }
  public classUpdate(
    studentId: number,
    classId: number,
    monthly: number,
    activeUntil: string,
    tx: Transaction
  ): boolean {
    const result = tx
      .update(this.model)
      .set({
        class_id: classId,
        monthly,
        active_until: activeUntil
      })
      .where(eq(this.model.id, studentId))
      .run()

    return result.changes > 0
  }

  active_student_active_until_update(endDate: string, tx: Transaction): boolean {
    const response = tx
      .update(this.model)
      .set({
        active_until: endDate
      })
      .where(sql`${students.transfer_date} IS NULL`)
      .run()

    return response.changes > 0
  }

  // list of all studnets

  public listOfAllStudent(): Student_Record[] {
    const list = this.db
      .select({
        id: students.id,
        reg_number: students.reg_number,
        student_name: students.student_name,
        father_name: students.father_name,
        mobile: students.mobile,
        address: students.address,
        admission_date: students.admission_date,
        // CASE WHEN transfer_date IS NULL THEN 'active' ELSE transfer_date END
        transfer_date: students.transfer_date,
        class_name: classes.name,
        current_balance: students.current_balance,
        dob: this.model.dob,
        caste: this.model.caste,
        category: this.model.category,
        religion: this.model.religion,
        gender: this.model.gender
      })
      .from(this.model)
      .innerJoin(classes, eq(students.class_id, classes.id))
      .orderBy(
        sql`${this.model.transfer_date} IS NOT NULL`, // NULL first
        classes.name,
        students.student_name,
        students.father_name
      )

      .all()

    return list
  }

  public listOfLastFeeMonthAgo(): StudentListLastFeeMonthAgo[] {
    const compareDate = format(new Date(), DB_DATE_FORMAT) // e.g., '2025-06-05'

    const list = this.db
      .select({
        student_id: this.model.id,
        class_id: this.model.class_id,
        last_fee_date: this.model.last_fee_date,
        active_until: this.model.active_until,
        monthly: this.model.monthly
      })
      .from(this.model)
      .where(
        sql`
      ${this.model.transfer_date} IS NULL AND
      strftime('%Y-%m', ${this.model.last_fee_date}) < strftime('%Y-%m', ${compareDate})
    `
      )
      .all()

    return list || []
  }

  // derement current balance
  public decrementBalance(studentId: number, amount: number, tx: Transaction): RunResult {
    console.log('Student Decrement : ', amount)
    return tx
      .update(students)
      .set({
        current_balance: sql`${students.current_balance} - ${amount}`
      })
      .where(eq(students.id, studentId))
      .run()
  }
  // inrement current balance
  public incrementBalance(studentId: number, amount: number, tx: Transaction): RunResult {
    return tx
      .update(students)
      .set({
        current_balance: sql`${students.current_balance} + ${amount}`
      })
      .where(eq(students.id, studentId))
      .run()
  }

  /**
   * Checks if a class name is unique.
   * @param name The class name to check.
   * @param id The ID of the class to exclude from the check (optional, for update operations).
   * @returns A boolean indicating if the name is unique.
   */
  regNumberUnique(reg_number: string, id: number = 0): boolean {
    const condition = [eq(this.model.reg_number, reg_number)]

    // If an ID is provided, add a condition to exclude that ID
    if (id > 0) {
      condition.push(not(eq(this.model.id, id)))
    }

    // Drizzle's `findFirst` is used to get a single record.
    // We check if the name exists, and return false if a record is found.
    const exists = this.db
      .select({
        name: this.model.reg_number
      })
      .from(this.model)
      .where(and(...condition))
      .get()

    // If `exists` is null or undefined, the name is unique.
    return !exists
  }
}

export default StudentRepository
