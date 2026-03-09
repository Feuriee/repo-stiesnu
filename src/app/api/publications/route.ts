export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET all publications with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const year = searchParams.get("year");
    const programStudy = searchParams.get("programStudy");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const isDashboard = searchParams.get("dashboard") === "true";

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    const uploaderId = session?.user?.id;
    
    // Non-admins can only see approved publications, UNLESS they are viewing their own dashboard
    let baseCondition: Record<string, unknown> = {};
    if (!isAdmin) {
      if (isDashboard && uploaderId) {
        baseCondition = { uploaderId };
      } else {
        baseCondition = { isApproved: true };
      }
    }

    const where: Record<string, unknown> = {
      ...baseCondition,
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
        { author: { name: { contains: search, mode: "insensitive" } } },
      ],
    };

    if (type) where.type = type;
    if (year) where.year = parseInt(year);
    if (programStudy) where.programStudy = programStudy;

    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        include: {
          author: true,
          keywords: { include: { keyword: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.publication.count({ where }),
    ]);

    return NextResponse.json({
      publications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Publications GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

// POST new publication
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DOSEN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, abstract, year, programStudy, type, pdfUrl, authorName, authorAffiliation, keywords } = data;

    // Default to uploader ID
    const uploaderId = session.user.id;

    // Create or find Author
    let author = await prisma.author.findFirst({
      where: { name: authorName }
    });

    if (!author) {
      author = await prisma.author.create({
        data: { name: authorName, affiliation: authorAffiliation }
      });
    }

    // Handle keywords
    const keywordArray = keywords ? keywords.split(',').map((k: string) => k.trim()) : [];
    
    // Create Publication
    const publication = await prisma.publication.create({
      data: {
        title,
        abstract,
        year: parseInt(year),
        programStudy,
        type,
        pdfUrl,
        authorId: author.id,
        uploaderId,
      }
    });

    // Link keywords
    for (const kw of keywordArray) {
      if (!kw) continue;
      
      let keywordRecord = await prisma.keyword.findUnique({
        where: { name: kw.toLowerCase() }
      });

      if (!keywordRecord) {
        keywordRecord = await prisma.keyword.create({ data: { name: kw.toLowerCase() } });
      }

      await prisma.publicationKeyword.create({
        data: {
          publicationId: publication.id,
          keywordId: keywordRecord.id
        }
      });
    }

    return NextResponse.json({ success: true, publication }, { status: 201 });
  } catch (error) {
    console.error("Publication POST error:", error);
    return NextResponse.json(
      { message: "Failed to create publication" },
      { status: 500 }
    );
  }
}
