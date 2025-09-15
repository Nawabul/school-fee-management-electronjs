import { BaseController } from './BaseController'
import { Student_Details } from '@type/interfaces/student'
import { Student_Record, Student_Get, Student_Write } from '@renderer/types/ts/student'
import { StudentTransferSchema } from '@renderer/types/schema/student'

class StudentController extends BaseController {
  async create(data: Student_Write): Promise<number> {
    return super.handleIpc(window.student.create(data))
  }

  async update(id: number, data: Partial<Student_Write>): Promise<boolean> {
    return super.handleIpc(window.student.update(id, data))
  }

  async transfer(id: number, data: StudentTransferSchema): Promise<boolean> {
    return super.handleIpc(window.student.transfer(id, data))
  }

  async continue(id: number): Promise<boolean> {
    return super.handleIpc(window.student.continue(id))
  }

  async delete(id: number): Promise<boolean> {
    return super.handleIpc(window.student.delete(id))
  }

  async list(): Promise<Student_Record[]> {
    return super.handleIpc(window.student.list())
  }

  async fetch(id: number): Promise<Student_Get> {
    return super.handleIpc(window.student.fetch(id))
  }

  async details(id: number): Promise<Student_Details> {
    return super.handleIpc(window.student.details(id))
  }
}

export default new StudentController()
