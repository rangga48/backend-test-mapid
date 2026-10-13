import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const getPoolConfig = (): PoolConfig => {
  if (process.env.DATABASE_URL) {
    const isCloudDb =
      process.env.DATABASE_URL.includes('supabase') ||
      process.env.DATABASE_URL.includes('neon') ||
      process.env.DATABASE_URL.includes('render') ||
      process.env.DATABASE_URL.includes('sslmode=require');

    const useSsl = process.env.DATABASE_SSL === 'true' || isCloudDb;

    return {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    };
  }

  const useSsl = process.env.DATABASE_SSL === 'true';

  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'field_reports_db',
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
};

export const pool = new Pool(getPoolConfig());

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
