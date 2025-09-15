import { Class as ClassTS } from '../../types/interfaces/class'
import { successResponse, errorResponse } from '../../types/utils/apiReturn'
import ClassService from '../service/ClassService'
import { IpcMainInvokeEvent } from 'electron'
import { BaseController } from './BaseController'

class ClassController extends BaseController {
  private service: typeof ClassService

  constructor() {
    super()
    this.service = ClassService

    this.create.bind(this)
    this.update.bind(this)
    this.delete.bind(this)
    this.list.bind(this)
    this.fetch.bind(this)
  }

  async create(
    _event: IpcMainInvokeEvent,
    data: Omit<ClassTS, 'id'>
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result: number = await this.service.create(data)
      return super.processSuccess(result, 'Class created successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Omit<ClassTS, 'id'>
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result: boolean = await this.service.update(id, data)
      return super.processSuccess(result, 'Class updated successfully')
    } catch (error: unknown) {
      return  super.processError(error)
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number | number[]
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result: boolean = await this.service.delete(id)
      if (!result) {
        return super.processError(new Error('Class not found or no changes made'))
      }
      return super.processSuccess(result, 'Class deleted successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  //@ts-ignore event name not used
  async list(): Promise<successResponse<ClassTS[]> | errorResponse> {
    try {
      const result: ClassTS[] = await this.service.list()
      return super.processSuccess(result, 'Classes fetched successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<ClassTS> | errorResponse> {
    try {
      const result = this.service.get(id)
      if (!result) {
        return super.processError(new Error('Class not found'))
      }
      return super.processSuccess(result, 'Class fetched successfully')
    } catch (error: unknown) {
      return super.processError(error)
    }
  }
}

export default new ClassController()
