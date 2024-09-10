import * as dotenv from 'dotenv';
import { defineConfig, type Config } from 'drizzle-kit'

dotenv.config();
// const isDev = import.meta.env.MODE == 'development';
const config: Config = {
  schema: './app/lib/db/schema.ts',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  out: './app/lib/db/migrations/data'
}

export default defineConfig(config);