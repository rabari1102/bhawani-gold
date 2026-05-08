import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'bhawani-jewellers-secret-key-change-in-production';

export interface JWTPayload {
  adminId?: string;
  userId?: string;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getTokenFromRequest(request: Request, type: 'admin' | 'user' = 'admin'): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const cookieName = type === 'admin' ? 'admin_token=' : 'user_token=';
    const tokenCookie = cookies.find(c => c.startsWith(cookieName));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
}

export function authenticateRequest(request: Request, type: 'admin' | 'user' = 'admin'): JWTPayload | null {
  const token = getTokenFromRequest(request, type);
  if (!token) return null;
  return verifyToken(token);
}
