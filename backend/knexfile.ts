import path from 'path';
import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'securechat_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: { min: 0, max: Number(process.env.DB_POOL_MAX) || 5 },
  migrations: {
    directory: path.join(__dirname, 'database/migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, 'database/seeds'),
    extension: 'ts',
  },
};

export default config;
