// src/repositories/ClassRepository.ts
import BaseRepository from './BaseRepository'
import { students } from '@main/db/schema/student' // drizzle table schema

class StudentRepository extends BaseRepository<typeof students> {
  protected model = students
}

export default StudentRepository
