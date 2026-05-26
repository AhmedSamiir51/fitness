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

    const entries = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching weight entries:", error);
    return NextResponse.json({ error: "فشل في جلب قياسات الوزن" }, { status: 500 });
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

    const entry = await prisma.weightEntry.create({
      data: {
        userId,
        weightKg: parseFloat(body.weightKg),
        date: new Date(body.date),
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating weight entry:", error);
    return NextResponse.json({ error: "فشل في إضافة القياس" }, { status: 500 });
  }
}
