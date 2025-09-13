import { BaseService } from './BaseService'
import MisItemRepository from '@main/repository/MisItemRepository'
import { Mis_Item_Write, Mis_Item_Read, Mis_Item_Record } from '../../types/interfaces/mis_item'
import MisItemNotFoundException from '@main/exception.ts/MisItemNotFoundException'

class MisItemService extends BaseService {
  private repo: MisItemRepository

  constructor() {
    super()
    this.repo = new MisItemRepository()
  }

  // ✅ Create new MIS item
  async create(data: Omit<Mis_Item_Write, 'id'>): Promise<number> {
    try {
      const result = this.repo.create(data)
      return result.id
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Update MIS item
  async update(id: number, data: Omit<Mis_Item_Write, 'id'>): Promise<boolean> {
    try {
      const result = this.repo.update(id, data)
      return !!result
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Delete MIS item(s)
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

  // ✅ List MIS items
  async list(ids: number[] | null = null): Promise<Mis_Item_Record[]> {
    try {
      const all = this.repo.findAll()
      if (ids) {
        return all.filter((item) => ids.includes(item.id))
      }
      return all
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  // ✅ Get single MIS item
  get(id: number): Mis_Item_Read | null {
    try {
      const item = this.repo.findById(id)
      if (!item) throw new MisItemNotFoundException()
      return item
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }
}

export default new MisItemService()
