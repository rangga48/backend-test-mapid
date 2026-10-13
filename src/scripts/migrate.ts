import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

const runMigration = async (): Promise<void> => {
  try {
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    console.log(` Reading schema file from: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    console.log(' Running migration on PostgreSQL database...');
    await pool.query(sql);

    console.log(' Migration completed successfully! Table "reports" is ready.');
  } catch (error: any) {
    console.error(' Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigration();
