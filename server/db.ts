import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to add it to your .env file?",
  );
}

// Membuat connection pool baru
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Menginisialisasi Drizzle dengan pool dan skema
export const db = drizzle(pool, { schema });
