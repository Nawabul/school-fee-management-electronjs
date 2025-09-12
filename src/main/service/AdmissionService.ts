import db from '@main/db/db'
import {
  Admission_Insert_Update,
  Admission_Read,
  Admission_Read_Paid_Unpaid,
  Admission_Record
} from '@type/interfaces/admission'
import { Transaction } from '@type/interfaces/db'
import AdmissionRepository from '@main/repository/AdmissionRepository'
import { BaseService } from './BaseService'
import AdjustmentRepository from '@main/repository/AdjustmentRepository'
import AdmissionNotFoundException from '@main/exception.ts/AdmissionNotFoundException'

class AdmissionService extends BaseService {
  private repo: AdmissionRepository
  private adjustRepo: AdjustmentRepository
  constructor() {
    super()
    this.repo = new AdmissionRepository()
    this.adjustRepo = new AdjustmentRepository()
  }
  create(data: Admission_Insert_Update, tx: Transaction = db): number {
    // create admission
    const result = this.repo.create(data, tx)
    return result.id
  }

  update(id: number, data: Admission_Insert_Update): boolean {
    const oldData = this.repo.findById(id)
    if (!oldData) {
      throw new AdmissionNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const result = this.repo.update(id, data, tx)
      const studentId = oldData.student_id
      const diff = data.amount - oldData.amount

      const amount = this.adjustRepo.adjustPayment(studentId, diff, 'admission')
      // adjust
      this.adjustRepo.adjustAdmission(studentId, amount, tx)
      return result
    })

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }
  delete(id: number): boolean {
    const result = db.transaction((tx: Transaction) => {
      const oldData = this.repo.findById(id)
      if (!oldData) {
        throw new AdmissionNotFoundException()
      }
      const result = this.repo.delete(id)
      const paid = oldData.paid

      this.adjustRepo.adjustPayment(oldData.student_id, -paid, 'admission', tx)

      return result
    })

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }

  /**
   * Deletes all records related to a given student.
   *
   * This is a service-level wrapper around the repository method.
   * It should be used inside a transaction when removing a student,
   * so that all dependent records (admission)
   * are cleared consistently.
   *
   * ⚠️ Use with caution — this action is irreversible.
   *
   * @param studentId - The ID of the student whose records should be deleted
   * @param tx - Optional transaction context (defaults to main db connection)
   * @returns The result of the repository delete operation
   */
  public deleteAllOfStudent(
    studentId: number,
    tx: Transaction = db
  ): ReturnType<AdmissionRepository['deleteAllOfStudent']> {
    return this.repo.deleteAllOfStudent(studentId, tx)
  }

  async list(studentId: number): Promise<Admission_Record[]> {
    try {
      return this.repo.listByStudent(studentId)
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }
  get(id: number): Admission_Read {
    try {
      const result = this.repo.findById(id)
      if (!result) {
        throw new AdmissionNotFoundException()
      }
      return result
    } catch (error) {
      throw super.processError(error)
    }
  }

  unpaid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    return this.repo.unpaid_list(studentId)
  }

  //paid list
  paid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    return this.repo.paid_list(studentId)
  }
  paid(id: number, amount: number, tx: Transaction = db): boolean {
    const pay = this.repo.paid(id, amount, tx)
    return pay
  }

  // unpaid reverse the paid amount

  unpaid(id: number, amount: number, tx: Transaction = db): boolean {
    return this.repo.unpaid(id, amount, tx)
  }
}

export default new AdmissionService()
