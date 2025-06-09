import { successResponse } from '../../../types/utils/apiReturn'
import { Mis_Item_Record, Mis_Item_Read } from '../../../types/interfaces/mis_item'

class MisItemController {
  async create(data): Promise<number> {
    const result = await window.mis_item.create(data)

    if (result.success) {
      return (result as successResponse<number>).data
    }
    throw result.message
  }
  async update(id: number, data): Promise<boolean> {
    const result = await window.mis_item.update(id, data)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async delete(id: number): Promise<boolean> {
    const result = await window.mis_item.delete(id)
    if (result.success) {
      return (result as successResponse<boolean>).data
    }
    throw result.message
  }
  async list(): Promise<Mis_Item_Record[]> {
    const result = await window.mis_item.list()
    if (result.success) {
      return (result as successResponse<Mis_Item_Record[]>).data
    }
    throw result.message
  }
  async fetch(id: number): Promise<Mis_Item_Read> {
    const result = await window.mis_item.fetch(id)

    if (result.success) {
      return (result as successResponse<Mis_Item_Read>).data
    }
    throw result.message
  }
}

export default new MisItemController()
