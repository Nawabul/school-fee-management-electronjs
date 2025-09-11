import ClassNotFoundException from '@main/exception.ts/ClassNotFoundException'
import { BaseService } from './BaseService'
import ClassRepository from '@main/repository/ClassRepository'
import { Class } from '@type/interfaces/class'

class ClassService extends BaseService {
  private repo: ClassRepository

  constructor() {
    super()
    this.repo = new ClassRepository()
  }

  // ✅ Create class
  async create(data: Omit<Class, 'id'>): Promise<number> {
    try {
      const result = this.repo.create(data)
      return result.id
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Update class
  async update(id: number, data: Omit<Class, 'id'>): Promise<boolean> {
    try {
      const result = this.repo.update(id, data)
      return !!result
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Delete class
  async delete(id: number | number[]): Promise<boolean> {
    try {
      if (Array.isArray(id)) {
        let success = true
        for (const singleId of id) {
          const res = this.repo.delete(singleId)
          if (!res) success = false
        }
        return success
      }
      return !!this.repo.delete(id)
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ List classes
  async list(ids: number[] | null = null): Promise<Class[]> {
    try {
      const all = this.repo.findAll()
      if (ids) {
        return all.filter((c) => ids.includes(c.id))
      }
      return all
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Get single class
  get(id: number): Class | null {
    try {
      const cls = this.repo.findById(id)
      if (!cls) {
        throw new ClassNotFoundException()
      }
      return cls || null
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }
}

export default new ClassService()
