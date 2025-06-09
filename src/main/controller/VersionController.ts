import { apiError, apiSuccess, errorResponse, successResponse } from '../../types/utils/apiReturn'
import { versions } from '../db/schema/version'

import VersionService from '../service/VersionService'
import { app } from 'electron'

class VersionController {
  async dbHandler(): Promise<successResponse<boolean> | errorResponse> {
    try {
      const current_version = app.getVersion()
      const table = await VersionService.tableExists('versions')
      if (!table) {
        // execute db schams
        const tableSetup = await VersionService.executeSchemasForLatest()

        if (tableSetup == true) {
          return apiSuccess(true, 'DB Refresh successfully')
        } else {
          return apiError('Failed to execute schema')
        }
      }

      const dbVersion = await VersionService.lastDBVersion()
      console.log('db', dbVersion)
      if (dbVersion == null) {
        // execute db schams
        const tableSetup = await VersionService.executeSchemasForLatest()

        if (tableSetup == true) {
          return apiSuccess(true, 'DB Refresh successfully')
        } else {
          return apiError('Failed to execute schema')
        }
      }

      if (dbVersion < current_version) {
        // execute further schemas
      }

      return apiSuccess(true, 'DB Check pass successfully')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('DB Checking fail')
      }
    }
  }
}

export default new VersionController()
