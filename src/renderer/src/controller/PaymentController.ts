import { successResponse } from '../../../types/utils/apiReturn'
import { Payment_Record, Payment_Read } from '../../../types/interfaces/payment'

class PaymentController {
  async create(studentId, data): Promise<number> {
    const body = {
      student_id: studentId,
      ...data
    }
    const result = await window.payment.create(body)
    if (result.success) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.payment.update(id, data)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number): Promise<boolean> {
    const result = await window.payment.delete(id)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(studentId: number): Promise<Payment_Record[]> {
    const result = await window.payment.list(studentId)
    if (result.success) {
      return (result as successResponse<Payment_Record[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Payment_Read> {
    const result = await window.payment.fetch(id)

    if (result.success) {
      return (result as successResponse<Payment_Read>).data
    }
    throw result.message
  }
}

export default new PaymentController()
