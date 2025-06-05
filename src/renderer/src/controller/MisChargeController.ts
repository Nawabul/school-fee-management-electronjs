import { successResponse } from '../../../types/utils/apiReturn'
import { Mis_Charge_Record, Mis_Charge_Read } from '../../../types/interfaces/mis_charge'

class MisChargeController {
  async create(studentId: number, data): Promise<number> {
    const body = {
      student_id: studentId,
      ...data
    }
    const result = await window.mis_charge.create(body)
    if (result.success) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.mis_charge.update(id, data)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number): Promise<boolean> {
    const result = await window.mis_charge.delete(id)

    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(studentId: number): Promise<Mis_Charge_Record[]> {
    const result = await window.mis_charge.list(studentId)
    if (result.success) {
      return (result as successResponse<Mis_Charge_Record[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Mis_Charge_Read> {
    const result = await window.mis_charge.fetch(id)

    if (result.success) {
      return (result as successResponse<Mis_Charge_Read>).data
    }
    throw result.message
  }
}

export default new MisChargeController()
