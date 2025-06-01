import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import db from "../db/db";
import Database from 'better-sqlite3';
import { classes } from "../db/schema/class";
class ClassService {
  db : BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database;
};
  constructor(){
    this.db = db;
  }
  async create(data){
    try {
      let result = this.db.insert(classes).values(data).returning({ id: classes.id }).get();

      return result.id;
    } catch (error) {
      throw "Error while creating class";
    }
  }
}

export default new ClassService();
