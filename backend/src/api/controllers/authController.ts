import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

export const loginWithAzureAD = async (req: Request, res: Response): Promise<void> => {
  try {
    // Azure AD login logic will be implemented
    const { email, name, azureId } = req.body;
    
    if (!email || !azureId) {
      throw new AppError(400, 'Email and Azure ID required');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: azureId, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      token,
      user: { email, name },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Authentication failed');
  }
};

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = (req: Request, res: Response): void => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      email: string;
    };
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    res.status(200).json({ token: newToken });
  } catch {
    throw new AppError(401, 'Invalid token');
  }
};
