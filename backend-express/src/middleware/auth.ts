import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    // Add user info to request object
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      (req as any).user = decoded;
    } catch (error) {
      // Intentionally ignore token errors for optional auth
    }
  }
  next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || user.role !== 'ADMIN') {
     res.status(403).json({ error: 'Forbidden: Requires Admin role' });
     return;
  }
  next();
};

export const nonGuestMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || user.role === 'GUEST') {
     res.status(403).json({ error: 'Forbidden: Guests cannot perform this action' });
     return;
  }
  next();
};
