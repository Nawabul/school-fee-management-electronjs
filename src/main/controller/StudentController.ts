// src/controller/StudentController.ts
import {
  Student_Details,
  Student_Get,
  Student_Record,
  Student_Write
} from '../../types/interfaces/student'
import { successResponse, errorResponse } from '../../types/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import StudentService from '../service/StudentService'
import { BaseController } from './BaseController'
import { StudentTransferSchema } from '@main/utils/schema/student'

interface StudentCreate extends Student_Write {
  admission_charge: number
}

class StudentController extends BaseController {
  private service: typeof StudentService

  constructor() {
    super()
    this.service = StudentService
  }

  async create(
    _event: IpcMainInvokeEvent,
    data: StudentCreate
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const studentId = await this.service.create(data)
      return super.processSuccess(studentId, 'Student created successfully')
    } catch (error) {
      throw super.processError(error)
    }
  }

  async update(
    _event: IpcMainInvokeEvent,
    id: number,
    data: Partial<Student_Write>
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await this.service.update(id, data)
      return super.processSuccess(result, 'Student updated successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async transfer(
    _event: IpcMainInvokeEvent,
    id: number,
    data: StudentTransferSchema
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await this.service.transfer(id, data)
      return super.processSuccess(result, 'Student transferred successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async continueStudy(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      // TODO: Implement service logic for continuing study
      const result = await this.service.continue(id)
      return super.processSuccess(result, 'Student re-started successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async delete(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = await this.service.delete(id)
      return super.processSuccess(result, 'Student deleted successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async list(): Promise<successResponse<Student_Record[]> | errorResponse> {
    try {
      const result = await this.service.list()
      return super.processSuccess(result, 'Fetched student list')
    } catch (error) {
      return super.processError(error)
    }
  }

  async fetch(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Student_Get | null> | errorResponse> {
    try {
      const result = await this.service.get(id)
      return super.processSuccess(result, 'Student fetched successfully')
    } catch (error) {
      return super.processError(error)
    }
  }

  async details(
    _event: IpcMainInvokeEvent,
    id: number
  ): Promise<successResponse<Student_Details | null> | errorResponse> {
    try {
      const result = await this.service.details(id)
      return super.processSuccess(result, 'Student details fetched successfully')
    } catch (error) {
      return super.processError(error)
    }
  }
}

export default new StudentController()
