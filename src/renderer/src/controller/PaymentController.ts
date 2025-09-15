import { BaseController } from './BaseController'
import { Payment_Record, Payment_Read, Payment_Type, Payment_Write } from '@type/interfaces/payment'

class PaymentController extends BaseController {
  async create(
    studentId: number,
    data: Omit<Payment_Write, 'student_id'>,
    type: Payment_Type = 'admission'
  ): Promise<number> {
    const body: Payment_Write = {
      student_id: studentId,
      ...data
    }
    return super.handleIpc(window.payment.create(body, type))
  }

  async update(id: number, data: Partial<Payment_Write>): Promise<boolean> {
    return super.handleIpc(window.payment.update(id, data))
  }

  async delete(id: number): Promise<boolean> {
    return super.handleIpc(window.payment.delete(id))
  }

  async list(studentId: number): Promise<Payment_Record[]> {
    return super.handleIpc(window.payment.list(studentId))
  }

  async fetch(id: number): Promise<Payment_Read> {
    return super.handleIpc(window.payment.fetch(id))
  }
}

export default new PaymentController()
