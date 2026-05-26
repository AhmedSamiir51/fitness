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
    const entryId = parseInt(params.id);

    const existing = await prisma.weightEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "القياس غير موجود" }, { status: 404 });
    }

    await prisma.weightEntry.delete({ where: { id: entryId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting weight entry:", error);
    return NextResponse.json({ error: "فشل في حذف القياس" }, { status: 500 });
  }
}
