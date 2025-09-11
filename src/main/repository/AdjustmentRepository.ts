import db from '@main/db/db'
import { Transaction } from '@type/interfaces/db'
import MonthlyRepository from './MonthlyRepository'
import PaymentRepository from './PaymentRepository'
import MisChargeRepository from './MisChargeRepository'
import { Payment_Type } from '@type/interfaces/payment'

export default class AdjustmentRepository {
  private monthlyRepo: MonthlyRepository
  private paymentRepo: PaymentRepository
  private misChargeRepo: MisChargeRepository

  constructor() {
    this.monthlyRepo = new MonthlyRepository()
    this.paymentRepo = new PaymentRepository()
    this.misChargeRepo = new MisChargeRepository()
  }

  /**
   * Adjust monthly fees for a student.
   * Positive amount → pay unpaid fees
   * Negative amount → reverse previously paid fees
   *
   * @param studentId - ID of the student
   * @param amount - Amount to adjust
   * @param tx - Optional transaction object
   * @returns Total amount applied (positive if added, negative if reversed)
   */
  adjustMonthly(studentId: number, amount: number, tx: Transaction = db): number {
    if (amount === 0) return 0

    let totalAdjusted = 0

    if (amount > 0) {
      // Pay unpaid fees
      const unpaidFees = this.monthlyRepo.unpaid_list(studentId)
      let remainingAmount = amount

      for (const fee of unpaidFees) {
        const feeRemaining = fee.amount - fee.paid
        if (feeRemaining <= 0) continue

        const appliedAmount = Math.min(remainingAmount, feeRemaining)
        this.monthlyRepo.paid(fee.id, appliedAmount, tx)
        totalAdjusted += appliedAmount
        remainingAmount -= appliedAmount
        if (remainingAmount <= 0) break
      }
    } else {
      // Reverse paid fees
      const paidFees = this.monthlyRepo.paid_list(studentId)
      let remainingAmount = Math.abs(amount)

      for (const fee of paidFees) {
        if (fee.paid <= 0) continue

        const reversedAmount = Math.min(remainingAmount, fee.paid)
        this.monthlyRepo.unpaid(fee.id, reversedAmount, tx)
        totalAdjusted += reversedAmount
        remainingAmount -= reversedAmount
        if (remainingAmount <= 0) break
      }

      totalAdjusted = -totalAdjusted // negative because it’s reversing
    }

    return totalAdjusted
  }

  /**
   * Adjust miscellaneous charges for a student.
   * Positive amount → pay unpaid charges
   * Negative amount → reverse paid charges
   *
   * @param studentId - ID of the student
   * @param amount - Amount to adjust
   * @param tx - Optional transaction object
   * @returns Total amount applied (positive if added, negative if reversed)
   */
  adjustMisCharge(studentId: number, amount: number, tx: Transaction = db): number {
    if (amount === 0) return 0

    let totalAdjusted = 0

    if (amount > 0) {
      const unpaidCharges = this.misChargeRepo.unpaid_list(studentId)
      let remainingAmount = amount

      for (const charge of unpaidCharges) {
        const chargeRemaining = charge.amount - charge.paid
        if (chargeRemaining <= 0) continue

        const appliedAmount = Math.min(remainingAmount, chargeRemaining)
        this.misChargeRepo.paid(charge.id, appliedAmount, tx)
        totalAdjusted += appliedAmount
        remainingAmount -= appliedAmount
        if (remainingAmount <= 0) break
      }
    } else {
      const paidCharges = this.misChargeRepo.paid_list(studentId)
      let remainingAmount = Math.abs(amount)

      for (const charge of paidCharges) {
        if (charge.paid <= 0) continue

        const reversedAmount = Math.min(remainingAmount, charge.paid)
        this.misChargeRepo.unpaid(charge.id, reversedAmount, tx)
        totalAdjusted += reversedAmount
        remainingAmount -= reversedAmount
        if (remainingAmount <= 0) break
      }

      totalAdjusted = -totalAdjusted
    }

    return totalAdjusted
  }

  /**
   * Adjust payment records for a student.
   * Positive amount → mark unused payments as used
   * Negative amount → reverse used payments
   *
   * @param studentId - ID of the student
   * @param amount - Amount to adjust
   * @param type - Payment type ('admission', 'monthly', 'mis_charge')
   * @param tx - Optional transaction object
   * @returns Total amount applied (positive if added, negative if reversed)
   */
  adjustPayment(
    studentId: number,
    amount: number,
    type: Payment_Type,
    tx: Transaction = db
  ): number {
    if (amount === 0) return 0

    let totalAdjusted = 0

    if (amount > 0) {
      const unusedPayments = this.paymentRepo.unsed_list(studentId)
      let remainingAmount = amount

      for (const payment of unusedPayments) {
        const paymentRemaining = payment.amount - payment.used
        if (paymentRemaining <= 0) continue

        const appliedAmount = Math.min(remainingAmount, paymentRemaining)
        this.paymentRepo.used(payment.id, appliedAmount, type, tx)
        totalAdjusted += appliedAmount
        remainingAmount -= appliedAmount
        if (remainingAmount <= 0) break
      }
    } else {
      const usedPayments = this.paymentRepo.used_list(studentId)
      let remainingAmount = Math.abs(amount)

      for (const payment of usedPayments) {
        if (payment.used <= 0) continue

        const reversedAmount = Math.min(remainingAmount, payment.used)
        this.paymentRepo.unused(payment.id, reversedAmount, type, tx)
        totalAdjusted += reversedAmount
        remainingAmount -= reversedAmount
        if (remainingAmount <= 0) break
      }

      totalAdjusted = -totalAdjusted
    }

    return totalAdjusted
  }
}
