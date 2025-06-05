import { successResponse } from '../../../types/utils/apiReturn'
import { Student_Record, Student_Get } from '@renderer/types/ts/student'

class StudentController {
  async create(data): Promise<number> {
    const result = await window.student.create(data)

    if (result.status) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.student.update(id, data)
    if (result.status) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number): Promise<boolean> {
    const result = await window.student.delete(id)
    if (result.status) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(): Promise<Student_Record[]> {
    const result = await window.student.list()

    if (result.status) {
      return (result as successResponse<Student_Record[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Student_Get> {
    const result = await window.student.fetch(id)

    if (result.status) {
      return (result as successResponse<Student_Get>).data
    }
    throw result.message
  }
}

export default new StudentController()
