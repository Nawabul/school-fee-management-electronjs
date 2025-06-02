import { defineConfig } from "drizzle-kit";


export default defineConfig({
  dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/main/db/schema/*',
  out:"./src/main/db/migrations/*",
  dbCredentials:{
		url:process.env.DB_FILE_NAME as string
  },
  verbose:true,
  strict:true,
})
