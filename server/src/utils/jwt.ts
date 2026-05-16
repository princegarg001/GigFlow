import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string & SignOptions['expiresIn'],
  };
  return jwt.sign(payload, getSecret(), options);
};

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, getSecret()) as JwtPayload;

