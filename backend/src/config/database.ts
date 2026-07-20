import path from 'path';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'securechat_db',
  },
  migrations: {
    directory: path.join(__dirname, '../../database/migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, '../../database/seeds'),
    extension: 'ts',
  },
});

export default db;
