import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import {
  Mis_Charge_Write,
  Mis_Charge_Record,
  Mis_Charge_Read,
  Mis_Charge_Read_Paid_Unpaid
} from '../../types/interfaces/mis_charge'
import AdjustmentRepository from '@main/repository/AdjustmentRepository'
import StudentRepository from '@main/repository/StudentRepository'
import { BaseService } from './BaseService'
import db from '@main/db/db'
import MisChargeRepository from '@main/repository/MisChargeRepository'
import MisChargeNotFoundException from '@main/exception.ts/MisChargeNotFoundException'
import { Monthly_Fee_Write } from '@type/interfaces/monthly_fee'
type Transaction = BetterSQLite3Database<Record<string, never>>
class MisChargeService extends BaseService {
  private repo: MisChargeRepository
  private adjustRepo: AdjustmentRepository
  private studentRepo: StudentRepository
  constructor() {
    super()
    this.repo = new MisChargeRepository()
    this.adjustRepo = new AdjustmentRepository()

    this.studentRepo = new StudentRepository()
  }

  /**
   * Create a new MIS charge and update student balance (transactional).
   */
  create(data: Mis_Charge_Write): number {
    const result = db.transaction((tx: Transaction) => {
      const studentId = data.student_id
      const haveAmount = this.adjustRepo.haveAmount(studentId)
      const paid = Math.min(haveAmount, data.amount)

      const create = this.repo.create(
        {
          ...data,
          paid
        },
        tx
      )

      this.studentRepo.decrementBalance(studentId, data.amount, tx)
      return create
    })

    return result.id
  }

  /**
   * Update a MIS charge and adjust the student balance accordingly (transactional).
   */
  update(id: number, data: Partial<Monthly_Fee_Write>): boolean {
    const old = this.repo.findById(id)
    if (!old) {
      throw new MisChargeNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const amount = data.amount ?? old.amount
      const diff = amount - old.amount
      const need = amount - old.paid
      const studentId = old.student_id
      const haveAmount = this.adjustRepo.haveAmount(studentId)
      const adjust = Math.min(haveAmount, need)

      const input = {
        ...data,
        paid: old.paid + adjust
      }
      const update = this.repo.update(id, input, tx)
      this.studentRepo.decrementBalance(studentId, diff, tx)
      if (need < 0) {
        this.adjustRepo.processExpenseDown(studentId, need, 'mis_charge', tx)
      }

      return update
    })

    return result.changes > 0
  }

  /**
   * Delete a MIS charge and revert the student balance (transactional).
   */
  delete(id: number): boolean {
    const old = this.repo.findById(id)
    if (!old) {
      throw new MisChargeNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const studentId = old.student_id
      const amount = old.amount
      const paid = old.paid

      const deleteData = this.repo.delete(id, tx)
      this.adjustRepo.processExpenseDown(studentId, -paid, 'mis_charge', tx)

      this.studentRepo.incrementBalance(studentId, amount, tx)

      return deleteData
    })
    return result.changes > 0
  }

  /**
   * Get all MIS charges.
   */
  list(studentId: number): Mis_Charge_Record[] {
    try {
      const list = this.repo.listByStudent(studentId)

      return list
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  /**
   * Get a single MIS charge by ID.
   */
  get(id: number): Mis_Charge_Read | null {
    const charge = this.repo.findById(id)

    return charge || null
  }

  unpaid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const list = this.repo.unpaid_list(studentId)
    return list
  }

  //paid list
  paid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const list = this.repo.paid_list(studentId)
    return list
  }
  paid(id: number, amount: number, tx: Transaction): boolean {
    const pay = this.repo.paid(id, amount, tx)
    return pay
  }

  // unpaid reverse the paid amount

  unpaid(id: number, amount: number, tx: Transaction): boolean {
    const pay = this.repo.unpaid(id, amount, tx)
    return pay
  }
}

export default new MisChargeService()
