import db from '../config/database';

export interface ChatSession {
  id: string;
  user_id: string;
  topic?: string;
  started_at: Date;
  ended_at?: Date;
}

export const ChatSession = {
  async create(userId: string, topic?: string): Promise<ChatSession> {
    const [session] = await db('chat_sessions')
      .insert({ user_id: userId, topic })
      .returning('*');
    return session;
  },

  async findById(id: string): Promise<ChatSession | undefined> {
    return db('chat_sessions').where({ id }).first();
  },

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    return db('chat_sessions')
      .where({ user_id: userId })
      .orderBy('started_at', 'desc');
  },
};
