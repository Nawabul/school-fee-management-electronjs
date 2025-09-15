import { BaseController } from './BaseController'
import { Mis_Item_Record, Mis_Item_Read, Mis_Item_Write } from '@type/interfaces/mis_item'

class MisItemController extends BaseController {
  async create(data: Mis_Item_Write): Promise<number> {
    return super.handleIpc(window.mis_item.create(data))
  }

  async update(id: number, data: Partial<Mis_Item_Write>): Promise<boolean> {
    return super.handleIpc(window.mis_item.update(id, data))
  }

  async delete(id: number): Promise<boolean> {
    return super.handleIpc(window.mis_item.delete(id))
  }

  async list(): Promise<Mis_Item_Record[]> {
    return super.handleIpc(window.mis_item.list())
  }

  async fetch(id: number): Promise<Mis_Item_Read> {
    return super.handleIpc(window.mis_item.fetch(id))
  }
}

export default new MisItemController()
