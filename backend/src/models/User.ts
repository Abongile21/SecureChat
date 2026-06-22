import db from '../config/database';

export interface User {
  id: string;
  email: string;
  name: string;
  azure_id: string;
  role: 'employee' | 'manager' | 'admin';
  total_points: number;
  current_rank: number;
  created_at: Date;
  updated_at: Date;
}

export const User = {
  async findById(id: string): Promise<User | undefined> {
    return db('users').where({ id }).first();
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return db('users').where({ email }).first();
  },

  async findByAzureId(azureId: string): Promise<User | undefined> {
    return db('users').where({ azure_id: azureId }).first();
  },

  async create(userData: Partial<User>): Promise<User> {
    const [user] = await db('users').insert(userData).returning('*');
    return user;
  },

  async update(id: string, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db('users')
      .where({ id })
      .update(userData)
      .returning('*');
    return user;
  },

  async getLeaderboard(limit: number = 20): Promise<User[]> {
    return db('users')
      .orderBy('total_points', 'desc')
      .limit(limit);
  },
};
