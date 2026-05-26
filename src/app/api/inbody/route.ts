import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const images = await prisma.inbodyImage.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching inbody images:", error);
    return NextResponse.json({ error: "فشل في جلب الصور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();

    const entry = await prisma.inbodyImage.create({
      data: {
        userId,
        imageUrl: body.imageUrl,
        date: new Date(body.date),
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating inbody entry:", error);
    return NextResponse.json({ error: "فشل في إضافة الصورة" }, { status: 500 });
  }
}
