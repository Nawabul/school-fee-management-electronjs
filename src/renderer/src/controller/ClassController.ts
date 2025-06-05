import { successResponse } from '../../../types/utils/apiReturn'
import { Class } from '../../../types/interfaces/class'

class ClassController {
  async create(data): Promise<number> {
    const result = await window.class.create(data)
    if (result.status) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.class.update(id, data)
    if (result.status) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number | number[]): Promise<boolean> {
    const result = await window.class.delete(id)
    if (result.status) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(): Promise<Class[]> {
    const result = await window.class.list()

    if (result.status) {
      return (result as successResponse<Class[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Class> {
    const result = await window.class.fetch(id)

    if (result.status) {
      return (result as successResponse<Class>).data
    }
    throw result.message
  }
}

export default new ClassController()
