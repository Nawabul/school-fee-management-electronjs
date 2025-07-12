import { DB_VERSION_NAME } from './config'
const app_version = '1.0.3'
export const currentSchemaStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS classes (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    admission_charge integer DEFAULT 0 NOT NULL
  );`,

  `CREATE UNIQUE INDEX IF NOT EXISTS classes_name_unique ON classes (name);`,

  `CREATE TABLE IF NOT EXISTS mis_items (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    amount integer DEFAULT 0 NOT NULL
  );`,

  `CREATE UNIQUE INDEX IF NOT EXISTS mis_items_name_unique ON mis_items (name);`,

  `CREATE TABLE IF NOT EXISTS students (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    reg_number text NOT NULL,
    student_name text NOT NULL,
    father_name text NOT NULL,
    mobile text NOT NULL,
    is_whatsapp integer DEFAULT 0 NOT NULL,
    admission_date text NOT NULL,
    transfer_date text,
    address text NOT NULL,
    initial_balance integer DEFAULT 0 NOT NULL,
    current_balance integer DEFAULT 0 NOT NULL,
    monthly integer DEFAULT 0 NOT NULL,
    class_id integer NOT NULL,
    last_fee_date text NOT NULL,
    active_until text,
    last_notification_date text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

  `CREATE UNIQUE INDEX IF NOT EXISTS students_reg_number_unique ON students (reg_number);`,

  `CREATE TABLE IF NOT EXISTS monthly_fee (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    date text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
     paid integer DEFAULT 0 NOT NULL,
    student_id integer NOT NULL,
    class_id integer NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

  `CREATE TABLE IF NOT EXISTS payments (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    date text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    used integer DEFAULT 0 NOT NULL,
    admission integer DEFAULT 0 NOT NULL,
    monthly integer DEFAULT 0 NOT NULL,
    mis_charge integer DEFAULT 0 NOT NULL,
    student_id integer NOT NULL,
    remark text,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

  `CREATE TABLE IF NOT EXISTS mis_charges (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    student_id integer NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
   paid integer DEFAULT 0 NOT NULL,
    date text NOT NULL,
    item_id integer NOT NULL,
    remark text,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
    FOREIGN KEY (item_id) REFERENCES mis_items(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

  `CREATE TABLE IF NOT EXISTS versions (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    value text NOT NULL
  );`,

  // create admission table
  `CREATE TABLE IF NOT EXISTS admission (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        student_id integer NOT NULL,
        class_id integer NOT NULL,
        amount integer DEFAULT 0 NOT NULL,
        paid integer DEFAULT 0 NOT NULL,
        monthly integer DEFAULT 0 NOT NULL,
        date text NOT NULL,
        remark text,
        FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
      );`,

  `CREATE UNIQUE INDEX IF NOT EXISTS versions_name_unique ON versions (name);`,
  `INSERT INTO versions(name, value) VALUES ('${DB_VERSION_NAME}', '${app_version}')`
]

const versionSchemaStatements: Record<string, string[]> = {
  '1.0.0': [
    `CREATE TABLE IF NOT EXISTS classes (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    amount integer DEFAULT 0 NOT NULL
  );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS classes_name_unique ON classes (name);`,

    `CREATE TABLE IF NOT EXISTS mis_items (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    amount integer DEFAULT 0 NOT NULL
  );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS mis_items_name_unique ON mis_items (name);`,

    `CREATE TABLE IF NOT EXISTS students (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    reg_number text NOT NULL,
    student_name text NOT NULL,
    father_name text NOT NULL,
    mobile text NOT NULL,
    is_whatsapp integer DEFAULT 0 NOT NULL,
    admission_date text NOT NULL,
    transfer_date text,
    address text NOT NULL,
    initial_balance integer DEFAULT 0 NOT NULL,
    current_balance integer DEFAULT 0 NOT NULL,
    class_id integer NOT NULL,
    last_fee_date text NOT NULL,
    last_notification_date text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS students_reg_number_unique ON students (reg_number);`,

    `CREATE TABLE IF NOT EXISTS monthly_fee (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    date text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    student_id integer NOT NULL,
    class_id integer NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

    `CREATE TABLE IF NOT EXISTS payments (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    date text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    student_id integer NOT NULL,
    remark text,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

    `CREATE TABLE IF NOT EXISTS mis_charges (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    student_id integer NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    date text NOT NULL,
    item_id integer NOT NULL,
    remark text,
    FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
    FOREIGN KEY (item_id) REFERENCES mis_items(id) ON UPDATE NO ACTION ON DELETE RESTRICT
  );`,

    `CREATE TABLE IF NOT EXISTS versions (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    value text NOT NULL
  );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS versions_name_unique ON versions (name);`
  ],
  // 1.0.1: Add admission table
  '1.0.1': [
    `CREATE TABLE IF NOT EXISTS admission (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        student_id integer NOT NULL,
        class_id integer NOT NULL,
        amount integer DEFAULT 0 NOT NULL,
        date text NOT NULL,
        remark text,
        FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE NO ACTION ON DELETE RESTRICT,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE NO ACTION ON DELETE RESTRICT
      );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS admission_student_class_unique ON admission (student_id, class_id);`,

    // add admission charge in class table
    `ALTER TABLE classes ADD COLUMN admission_charge integer DEFAULT 0 NOT NULL;`
  ],
  // 1.0.2 payment status of each
  '1.0.2': [
    `ALTER TABLE students ADD COLUMN active_until text;`,
    `ALTER TABLE payments ADD COLUMN used INTEGER DEFAULT 0 NOT NULL;`,
    `ALTER TABLE payments ADD COLUMN admission INTEGER DEFAULT 0 NOT NULL;`,
    `ALTER TABLE payments ADD COLUMN monthly INTEGER DEFAULT 0 NOT NULL;`,
    `ALTER TABLE payments ADD COLUMN mis_charge INTEGER DEFAULT 0 NOT NULL;`,
    `ALTER TABLE admission ADD COLUMN paid integer DEFAULT 0 NOT NULL;`,
    `ALTER TABLE monthly_fee ADD COLUMN paid integer DEFAULT 0 NOT NULL;`,
    `ALTER TABLE mis_charges ADD COLUMN paid integer DEFAULT 0 NOT NULL;`,
    `DROP INDEX IF EXISTS admission_student_class_unique;`
  ],
  // 1.0.3: Custom monthly charge
  '1.0.3': [
    `ALTER TABLE students ADD COLUMN monthly INTEGER DEFAULT 0 NOT NULL;`,
    `ALTER TABLE admission ADD COLUMN monthly INTEGER DEFAULT 0 NOT NULL;`,
    `UPDATE students SET monthly = ( SELECT classes.amount FROM classes WHERE classes.id = students.class_id);`
  ]
}

export const getVersionSchemaStatements = (version: string): string[] => {
  const versionsKeys = Object.keys(versionSchemaStatements)

  // filter all higher versions
  const index = versionsKeys.indexOf(version)
  if (index === -1) {
    return []
  }
  const statements: string[] = []
  for (let i = index + 1; i < versionsKeys.length; i++) {
    statements.push(...versionSchemaStatements[versionsKeys[i]])
  }
  statements.push(`UPDATE versions SET value = '${app_version}' WHERE name = '${DB_VERSION_NAME}';`)

  return statements
}
