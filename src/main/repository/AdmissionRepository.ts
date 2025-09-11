// src/repositories/MonthlyRepository.ts
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm'
import BaseRepository from './BaseRepository'
import { admission } from '@main/db/schema/admission'
import { classes } from '@main/db/schema/class'
import { Transaction } from '@type/interfaces/db'
import { Admission_Read_Paid_Unpaid, Admission_Record } from '@type/interfaces/admission'

class AdmissionRepository extends BaseRepository<typeof admission> {
  protected model = admission

  constructor() {
    super()
  }

  /**
   * Get all admissions for a student.
   * @param studnentId - ID of the student
   * @returns Array of admission records
   */
  list(studnentId: number): Admission_Record[] {
    return this.listByStudent(studnentId)
  }

  /**
   * Get detailed admissions for a student, including class name.
   * @param studentId - ID of the student
   * @returns Array of admission records with class name
   */
  listByStudent(studentId: number): Admission_Record[] {
    return this.db
      .select({
        id: admission.id,
        date: admission.date,
        amount: admission.amount,
        monthly: admission.monthly,
        paid: admission.paid,
        remark: admission.remark,
        class: classes.name
      })
      .from(admission)
      .where(eq(admission.student_id, studentId))
      .orderBy(desc(admission.id))
      .innerJoin(classes, eq(admission.class_id, classes.id))
      .all()
  }

  /**
   * List only unpaid admissions for a student.
   * @param studentId - ID of the student
   * @returns Array of admissions with unpaid amount
   */
  unpaid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    const condition = [eq(admission.student_id, studentId), lt(admission.paid, admission.amount)]

    return this.db
      .select({
        id: admission.id,
        amount: admission.amount,
        paid: admission.paid
      })
      .from(admission)
      .where(and(...condition))
      .orderBy(desc(admission.paid), admission.date)
      .all()
  }

  /**
   * List only paid admissions for a student.
   * @param studentId - ID of the student
   * @returns Array of admissions that have been partially or fully paid
   */
  paid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    const condition = [eq(admission.student_id, studentId), gt(admission.paid, 0)]
    return this.db
      .select({
        id: admission.id,
        amount: admission.amount,
        paid: admission.paid
      })
      .from(admission)
      .where(and(...condition))
      .orderBy(admission.paid, desc(admission.date))
      .all()
  }

  /**
   * Add a paid amount to a specific admission.
   * @param admissionId - ID of the admission
   * @param amount - Amount to add to the paid field
   * @param tx - Optional transaction object
   * @returns True if update was successful, false otherwise
   */
  paid(admissionId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(admission)
      .set({ paid: sql`${admission.paid} + ${amount}` })
      .where(eq(admission.id, admissionId))
      .run()
    return result.changes > 0
  }

  /**
   * Reduce the paid amount for a specific admission (reverse payment).
   * @param admissionId - ID of the admission
   * @param amount - Amount to subtract from the paid field
   * @param tx - Optional transaction object
   * @returns True if update was successful, false otherwise
   */
  unpaid(admissionId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(admission)
      .set({ paid: sql`${admission.paid} - ${amount}` })
      .where(eq(admission.id, admissionId))
      .run()
    return result.changes > 0
  }
}

export default AdmissionRepository
