import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const startServer = async (): Promise<void> => {
  try {
    // Test PostgreSQL database connection
    const client = await pool.connect();
    console.log(' Successfully connected to PostgreSQL database');
    client.release();
  } catch (err: any) {
    console.error(' Failed to connect to PostgreSQL database:', err.message);
    console.error('Please verify your database credentials in the .env file.');
  }

  const server = app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    console.log(` API Base URL: http://localhost:${PORT}/api/reports`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      console.log(' Database pool closed. Server terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
