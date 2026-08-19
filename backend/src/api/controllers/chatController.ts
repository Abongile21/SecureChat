import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { generateChatbotResponse } from '../../services/aiService';
import { ChatSession } from '../../models/ChatSession';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user?.id;

    if (!message || !chatId || !userId) {
      throw new AppError(400, 'Message, chat ID, and authenticated user are required');
    }

    const session = await ChatSession.findById(chatId);
    if (!session || session.user_id !== userId) {
      throw new AppError(404, 'Conversation not found');
    }

    // Get AI response
    const response = await generateChatbotResponse(message, chatId);

    const savedMessage = await ChatSession.addMessage(chatId, userId, message.trim(), response);

    res.status(200).json({
      chatId,
      messageId: savedMessage.id,
      userMessage: message.trim(),
      botResponse: response,
      timestamp: savedMessage.created_at,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to process message');
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, 'Authenticated user required');

    const session = await ChatSession.findById(chatId);
    if (!session || session.user_id !== userId) {
      throw new AppError(404, 'Conversation not found');
    }

    const messages = await ChatSession.getMessages(chatId);
    res.status(200).json({
      chatId,
      messages: messages.flatMap((item) => [
        { id: `${item.id}:user`, role: 'user', content: item.user_message, timestamp: item.created_at },
        { id: `${item.id}:assistant`, role: 'assistant', content: item.bot_response, timestamp: item.created_at },
      ]),
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch chat history');
  }
};

export const startNewChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) throw new AppError(401, 'Authenticated user required');
    const session = await ChatSession.create(req.user.id);
    res.status(201).json({
      chatId: session.id,
      createdAt: session.started_at,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to start new chat');
  }
};
