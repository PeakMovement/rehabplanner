import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const bodyRegion = searchParams.get("bodyRegion");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { instructions: { contains: search, mode: "insensitive" } },
        { equipment: { contains: search, mode: "insensitive" } },
      ];
    }

    if (bodyRegion) {
      where.bodyRegion = bodyRegion;
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const exercise = await prisma.exercise.create({
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

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error("Failed to create exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}
