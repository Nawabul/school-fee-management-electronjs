// src/repositories/ClassRepository.ts
import BaseRepository from './BaseRepository'
import { classes } from '@main/db/schema/class' // drizzle table schema

class ClassRepository extends BaseRepository<typeof classes> {
  protected model = classes
}

export default ClassRepository
