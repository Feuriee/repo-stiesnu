export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalPublications = await prisma.publication.count();
    const totalAuthors = await prisma.author.count();
    
    // Group by type for some statistics
    const publicationsByTypeRaw = await prisma.publication.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    });

    const publicationsByType = publicationsByTypeRaw.map((item: { type: string; _count: { _all: number } }) => ({
      name: item.type,
      value: item._count._all
    }));

    return NextResponse.json({
      totalPublications,
      totalAuthors,
      publicationsByType,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
