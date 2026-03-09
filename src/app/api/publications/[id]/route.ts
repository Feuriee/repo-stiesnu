export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();
    const { title, abstract, year, programStudy, type, pdfUrl, authorName, authorAffiliation, keywords } = data;

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

    // Update Publication
    const publication = await prisma.publication.update({
      where: { id },
      data: {
        title,
        abstract,
        year: parseInt(year),
        programStudy,
        type,
        ...(pdfUrl ? { pdfUrl } : {}),
        authorId: author.id,
      }
    });

    // Delete existing keywords link
    await prisma.publicationKeyword.deleteMany({
      where: { publicationId: id }
    });

    // Link new keywords
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

    return NextResponse.json({ success: true, publication }, { status: 200 });
  } catch (error) {
    console.error("Publication PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update publication" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete existing keywords link
    await prisma.publicationKeyword.deleteMany({
      where: { publicationId: id }
    });

    // Delete publication
    await prisma.publication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Publication DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete publication" },
      { status: 500 }
    );
  }
}
