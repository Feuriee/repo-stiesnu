import express, { type Request, type Response, type NextFunction } from 'express';
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
import { getStats } from './controllers/stats';

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

app.get('/api/stats', getStats);

// Dedicated standalone PDF upload
app.post('/api/upload', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// ─── Global Error Handler (500 / 5xx) ────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error]', err);

  const statusCode = (err as any).status ?? (err as any).statusCode ?? 500;
  const statusText =
    statusCode === 503
      ? 'Service Unavailable'
      : statusCode === 502
        ? 'Bad Gateway'
        : 'Internal Server Error';

  res.status(statusCode).json({
    status: statusCode,
    error: statusText,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
