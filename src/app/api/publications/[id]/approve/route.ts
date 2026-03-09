export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { isApproved } = data;

    const publication = await prisma.publication.update({
      where: { id: params.id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, publication });
  } catch (error) {
    console.error("Publication approval error:", error);
    return NextResponse.json(
      { message: "Failed to update publication approval status" },
      { status: 500 }
    );
  }
}
