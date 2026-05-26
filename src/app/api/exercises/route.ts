import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all exercises for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(req.url);
    const dayOfWeek = searchParams.get("dayOfWeek");

    const where: any = { userId };
    if (dayOfWeek !== null) {
      where.dayOfWeek = parseInt(dayOfWeek);
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { orderIndex: "asc" }],
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json({ error: "فشل في جلب التمارين" }, { status: 500 });
  }
}

// Create a new exercise
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();

    const exercise = await prisma.exercise.create({
      data: {
        userId,
        dayOfWeek: body.dayOfWeek,
        name: body.name,
        sets: body.sets,
        reps: body.reps,
        formNote: body.formNote || null,
        youtubeUrl: body.youtubeUrl || null,
        muscleImageUrl: body.muscleImageUrl || null,
        orderIndex: body.orderIndex || 0,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json({ error: "فشل في إنشاء التمرين" }, { status: 500 });
  }
}
