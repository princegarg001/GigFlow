import { Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, role });
  const token = signToken({ userId: user._id.toString(), role: user.role });

  res.status(201).json({ success: true, data: { user, token } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });
  res.json({ success: true, data: { user, token } });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
};
