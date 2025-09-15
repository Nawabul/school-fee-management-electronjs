// src/repositories/ClassRepository.ts
import { eq, and, not } from 'drizzle-orm'
import BaseRepository from './BaseRepository'
import { classes } from '@main/db/schema/class'

class ClassRepository extends BaseRepository<typeof classes> {
  protected model = classes

  /**
   * Checks if a class name is unique.
   * @param name The class name to check.
   * @param id The ID of the class to exclude from the check (optional, for update operations).
   * @returns A boolean indicating if the name is unique.
   */
  nameUnique(name: string, id: number = 0): boolean {
    const condition = [eq(this.model.name, name)]

    // If an ID is provided, add a condition to exclude that ID
    if (id > 0) {
      condition.push(not(eq(this.model.id, id)))
    }

    // Drizzle's `findFirst` is used to get a single record.
    // We check if the name exists, and return false if a record is found.
    const exists = this.db
      .select({
        name: this.model.name
      })
      .from(this.model)
      .where(and(...condition))
      .get()

    // If `exists` is null or undefined, the name is unique.
    return !exists
  }
}

export default ClassRepository
