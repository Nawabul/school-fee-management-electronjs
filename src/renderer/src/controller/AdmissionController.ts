import { BaseController } from './BaseController'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'

class AdmissionController extends BaseController {
  async create(studentId: number, data: Omit<Admission_Write, 'student_id'>): Promise<number> {
    const body: Admission_Write = {
      student_id: studentId,
      ...data
    }
    return super.handleIpc(window.admission.create(body))
  }

  async list(studentId: number): Promise<Admission_Record[]> {
    return super.handleIpc(window.admission.list(studentId))
  }

  async delete(studentId: number): Promise<boolean> {
    return super.handleIpc(window.admission.delete(studentId))
  }
}

export default new AdmissionController()
