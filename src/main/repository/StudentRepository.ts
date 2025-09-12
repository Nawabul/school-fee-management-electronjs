// src/repositories/ClassRepository.ts
import { Transaction } from '@type/interfaces/db'
import BaseRepository from './BaseRepository'
import { students } from '@main/db/schema/student' // drizzle table schema
import { eq, sql } from 'drizzle-orm'
import { RunResult } from 'better-sqlite3'
import { Student_Details, Student_Record } from '@type/interfaces/student'
import { classes } from '@main/db/schema/class'

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
    tx: Transaction
  ): boolean {
    const result = tx
      .update(this.model)
      .set({
        class_id: classId,
        monthly
      })
      .where(eq(this.model.id, studentId))
      .run()

    return result.changes > 0
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
        current_balance: students.current_balance
      })
      .from(this.model)
      .innerJoin(classes, eq(students.class_id, classes.id))
      .orderBy(classes.name, students.student_name, students.father_name)
      .all()

    return list
  }

  // derement current balance
  public decrementBalance(studentId: number, amount: number, tx: Transaction): RunResult {
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
}

export default StudentRepository
