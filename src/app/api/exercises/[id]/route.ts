import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: params.id },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Failed to fetch exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const exercise = await prisma.exercise.update({
      where: { id: params.id },
      data: {
        name: body.name,
        bodyRegion: body.bodyRegion,
        category: body.category,
        difficulty: body.difficulty,
        equipment: body.equipment || null,
        instructions: body.instructions,
        defaultSets: body.defaultSets ? parseInt(body.defaultSets) : undefined,
        defaultReps: body.defaultReps ? parseInt(body.defaultReps) : undefined,
        defaultHold: body.defaultHold ? parseInt(body.defaultHold) : null,
        defaultRest: body.defaultRest ? parseInt(body.defaultRest) : null,
        imageUrl: body.imageUrl || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Failed to update exercise:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await prisma.exercise.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    );
  }
}
