import { Class as ClassTS } from '../../types/interfaces/class'
import { successResponse, errorResponse, apiSuccess, apiError } from '../../types/utils/apiReturn'
import ClassService from '../service/ClassService'

class ClassController {
  async create(
    _: any,
    data: Omit<ClassTS, 'id'>
  ): Promise<successResponse<number> | errorResponse> {
    try {
      const result: number = await ClassService.create(data)

      return apiSuccess(result, 'Class created successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while creating class: ' + error.message)
      }
      return apiError('Error while creating class')
    }
  }
  //@ts-ignore event name not used
  async list(): Promise<successResponse<ClassTS[]> | errorResponse> {
    try {
      const result = await ClassService.list()
      console.log('class list', result)
      return apiSuccess(result, 'Class Fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching class: ' + error.message)
      }
      return apiError('Error while fetching class')
    }
  }

  async fetch(_: any, id: number): Promise<successResponse<ClassTS> | errorResponse> {
    try {
      const result = await ClassService.list(id)
      console.log('class fetch', result)
      if (result.length === 0) {
        return apiError('Class not found')
      }
      return apiSuccess(result[0], 'Class Fetched successfully')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiError('Error while fetching class: ' + error.message)
      }
      return apiError('Error while fetching class')
    }
  }
}

export default new ClassController()
