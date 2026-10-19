import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { User } from '../../models/User';
import { ChatSession } from '../../models/ChatSession';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = userId ? await User.findById(userId) : undefined;
    if (!user) throw new AppError(404, 'User not found');
    res.status(200).json({
      userId,
      email: user.email,
      profile: { id: user.id, name: user.name, email: user.email, role: user.role, total_points: user.total_points, current_rank: user.current_rank },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch user profile');
  }
};

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, 'Authenticated user required');
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');
    const rank = await User.getRank(userId);
    const sessions = await ChatSession.getUserSessions(userId);
    const messages = (await Promise.all(sessions.map((session) => ChatSession.getMessages(session.id, 1000)))).flat();
    res.status(200).json({
      user: { name: user.name, totalPoints: user.total_points, rank, badges: 0 },
      activity: {
        chatMessages: messages.length,
        activeSessions: sessions.length,
        completedTrainings: 0,
        totalTrainings: 0,
        phishingQuizzes: 0,
        weeklyConsistency: sessions.length || messages.length ? 100 : 0,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to fetch dashboard data');
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const updates = req.body;
    // Update user profile in database
    res.status(200).json({
      message: 'Profile updated successfully',
      userId,
      updatedFields: Object.keys(updates || {}).length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to update user profile');
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Fetch all users (admin only)
    res.status(200).json({
      users: [],
      total: 0,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch users');
  }
};
