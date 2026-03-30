import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateToken = (userId: string, email: string, role: string, name: string) => {
  return jwt.sign(
    { id: userId, email, role, name },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' } // 7 days expiration for standard login session
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Defaults to GUEST per schema
      },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!user.isApproved) {
      res.status(403).json({ error: 'Akun Anda sedang diverifikasi oleh Admin. Silakan tunggu persetujuan.' });
      return;
    }

    const token = generateToken(user.id, user.email, user.role, user.name);

    // Set HTTP-only cookie for better security, plus return token in body for flexibility
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getSession = async (req: Request, res: Response): Promise<void> => {
   const user = (req as any).user;
   if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
   }
   
   // Fetch fresh user data to ensure approval status and role are current
   try {
     const dbUser = await prisma.user.findUnique({
       where: { id: user.id },
       select: { id: true, name: true, email: true, role: true, isApproved: true }
     });
     
     if (!dbUser) {
       res.status(404).json({ error: 'User no longer exists' });
       return;
     }
     
     res.status(200).json({ user: dbUser });
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch session' });
   }
};
