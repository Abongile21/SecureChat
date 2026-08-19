import db from '../config/database';

export interface ChatSession {
  id: string;
  user_id: string;
  topic?: string;
  started_at: Date;
  ended_at?: Date;
}

export interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id: string;
  user_message: string;
  bot_response: string;
  created_at: Date;
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

  async addMessage(chatSessionId: string, userId: string, userMessage: string, botResponse: string): Promise<ChatMessage> {
    const [message] = await db('chat_messages')
      .insert({ chat_session_id: chatSessionId, user_id: userId, user_message: userMessage, bot_response: botResponse })
      .returning('*');
    return message;
  },

  async getMessages(chatSessionId: string): Promise<ChatMessage[]> {
    return db('chat_messages').where({ chat_session_id: chatSessionId }).orderBy('created_at', 'asc');
  },
};
