import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Update exercise
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const exerciseId = parseInt(params.id);
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.exercise.findFirst({
      where: { id: exerciseId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "التمرين غير موجود" }, { status: 404 });
    }

    const exercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        name: body.name,
        sets: body.sets,
        reps: body.reps,
        formNote: body.formNote,
        youtubeUrl: body.youtubeUrl,
        muscleImageUrl: body.muscleImageUrl,
        orderIndex: body.orderIndex,
        dayOfWeek: body.dayOfWeek,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json({ error: "فشل في تحديث التمرين" }, { status: 500 });
  }
}

// Delete exercise
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const exerciseId = parseInt(params.id);

    const existing = await prisma.exercise.findFirst({
      where: { id: exerciseId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "التمرين غير موجود" }, { status: 404 });
    }

    await prisma.exercise.delete({ where: { id: exerciseId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return NextResponse.json({ error: "فشل في حذف التمرين" }, { status: 500 });
  }
}
