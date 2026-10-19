import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI must be configured');
}

const client = new MongoClient(uri);
let databasePromise: Promise<Db> | undefined;

export const getDatabase = (): Promise<Db> => {
  if (!databasePromise) {
    databasePromise = client.connect().then(() => {
      const database = client.db(process.env.MONGODB_DB_NAME || process.env.DB_NAME || 'securechat_db');
      return Promise.all([
        database.collection('users').createIndex({ email: 1 }, { unique: true }),
        database.collection('chat_sessions').createIndex({ user_id: 1 }, { unique: true }),
        database.collection('chat_messages').createIndex({ chat_session_id: 1, created_at: -1 }),
      ]).then(() => database);
    });
  }

  return databasePromise;
};

export const closeDatabase = async (): Promise<void> => {
  if (databasePromise) {
    await client.close();
    databasePromise = undefined;
  }
};
