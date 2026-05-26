import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const imageId = parseInt(params.id);

    const existing = await prisma.inbodyImage.findFirst({
      where: { id: imageId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });
    }

    await prisma.inbodyImage.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inbody image:", error);
    return NextResponse.json({ error: "فشل في حذف الصورة" }, { status: 500 });
  }
}
