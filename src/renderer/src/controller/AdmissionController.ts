import { successResponse } from '@type/utils/apiReturn'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
class AdmissionController {
  async create(studentId: number, data: Omit<Admission_Write, 'student_id'>): Promise<number> {
    const body: Admission_Write = {
      student_id: studentId,
      ...data
    }
    const result = await window.admission.create(body)
    if (result.success) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }

  async list(studentId: number): Promise<Admission_Record[]> {
    const result = await window.admission.list(studentId)
    if (result.success) {
      return (result as successResponse<Admission_Record[]>).data
    }
    throw result.message
  }
  async delete(studentId: number): Promise<boolean> {
    const result = await window.admission.delete(studentId)
    if (result.success) {
      return true
    }
    throw result.message
  }
}

export default new AdmissionController()
