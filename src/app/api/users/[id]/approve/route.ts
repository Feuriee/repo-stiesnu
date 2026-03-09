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

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User approval error:", error);
    return NextResponse.json(
      { message: "Failed to update user approval status" },
      { status: 500 }
    );
  }
}
