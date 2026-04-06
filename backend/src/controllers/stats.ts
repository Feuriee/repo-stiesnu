import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalPublications = await prisma.publication.count({
      where: { isApproved: true } // Assuming public stats only include approved ones
    });
    
    const totalAuthors = await prisma.author.count();

    // Grouping by type
    const byType = await prisma.publication.groupBy({
      by: ['type'],
      _count: {
        type: true
      },
      where: { isApproved: true }
    });

    const publicationsByType = byType.map((t: any) => ({
      name: t.type,
      value: t._count.type
    }));

    res.status(200).json({
      totalPublications,
      totalAuthors,
      publicationsByType
    });
  } catch (error) {
    console.error('Failed to get stats', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
