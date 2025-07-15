import { Student_Details } from '@type/interfaces/student'
import { successResponse } from '../../../types/utils/apiReturn'
import { Student_Record, Student_Get } from '@renderer/types/ts/student'

class StudentController {
  async create(data): Promise<number> {
    const result = await window.student.create(data)

    if (result.success) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.student.update(id, data)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async transfer(id: number, data): Promise<boolean> {
    const result = await window.student.transfer(id, data)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async continue(id: number): Promise<boolean> {
    const result = await window.student.continue(id)

    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number): Promise<boolean> {
    const result = await window.student.delete(id)

    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(): Promise<Student_Record[]> {
    const result = await window.student.list()

    if (result.success) {
      return (result as successResponse<Student_Record[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Student_Get> {
    const result = await window.student.fetch(id)

    if (result.success) {
      return (result as successResponse<Student_Get>).data
    }
    throw result.message
  }
  async details(id: number): Promise<Student_Details> {
    const result = await window.student.details(id)

    if (result.success) {
      return (result as successResponse<Student_Details>).data
    }
    throw result.message
  }
}

export default new StudentController()
