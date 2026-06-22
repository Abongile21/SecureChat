import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { generateChatbotResponse } from '../../services/aiService';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user?.id;

    if (!message || !chatId) {
      throw new AppError(400, 'Message and chat ID required');
    }

    // Get AI response
    const response = await generateChatbotResponse(message, chatId);

    res.status(200).json({
      chatId,
      userMessage: message,
      botResponse: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to process message');
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    // Fetch chat history from database
    res.status(200).json({
      chatId,
      messages: [],
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch chat history');
  }
};

export const startNewChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Create new chat session
    res.status(201).json({
      chatId: 'new-chat-id',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new AppError(500, 'Failed to start new chat');
  }
};
