import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:5173', // Vue default port
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import pubRoutes from './routes/publication';
import { upload } from './controllers/publication';

// Test route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Static files (PDFs)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/publications', pubRoutes);

// Dedicated standalone PDF upload
app.post('/api/upload', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
