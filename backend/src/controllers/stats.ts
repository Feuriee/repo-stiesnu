import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalPublications = await prisma.publication.count({
      where: { isApproved: true } // Assuming public stats only include approved ones
    });
    
    const totalPendingPublications = await prisma.publication.count({
      where: { isApproved: false }
    });

    const totalAuthors = await prisma.author.count();

    const totalVerifiedUsers = await prisma.user.count({
      where: { isApproved: true }
    });

    const totalUnverifiedUsers = await prisma.user.count({
      where: { isApproved: false }
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      },
      where: { isApproved: true }
    });

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

    // Grouping by year for scatter / line charts
    const byYear = await prisma.publication.groupBy({
      by: ['year'],
      _count: {
        year: true
      },
      where: { isApproved: true },
      orderBy: {
        year: 'asc'
      }
    });

    const publicationsByYear = byYear.map((y: any) => ({
      year: y.year,
      count: y._count.year
    }));

    res.status(200).json({
      totalPublications,
      totalPendingPublications,
      totalAuthors,
      publicationsByType,
      totalVerifiedUsers,
      totalUnverifiedUsers,
      usersByRole: usersByRole.map((r: any) => ({ role: r.role, count: r._count.role })),
      publicationsByYear
    });
  } catch (error) {
    console.error('Failed to get stats', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
