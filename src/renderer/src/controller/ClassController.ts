import { BaseController } from './BaseController'
import { Class } from '@type/interfaces/class'

class ClassController extends BaseController {
  async list(): Promise<Class[]> {
    return super.handleIpc(window.class.list())
  }

  async create(data: Omit<Class, 'id'>): Promise<number> {
    return super.handleIpc(window.class.create(data))
  }

  async update(id: number, data: Partial<Class>): Promise<boolean> {
    return super.handleIpc(window.class.update(id, data))
  }

  async delete(id: number | number[]): Promise<boolean> {
    return super.handleIpc(window.class.delete(id))
  }

  async fetch(id: number): Promise<Class> {
    return super.handleIpc(window.class.fetch(id))
  }
}

export default new ClassController()
