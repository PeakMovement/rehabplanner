import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyOwnership(id: string, userId: string, role: string) {
  const prescription = await prisma.prescription.findFirst({
    where: {
      id,
      ...(role !== "admin" ? { clinicianId: userId } : {}),
    },
  });
  return prescription;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prescription = await prisma.prescription.findFirst({
    where: {
      id: params.id,
      ...(session.user.role !== "admin" ? { clinicianId: session.user.id } : {}),
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true },
      },
      clinician: {
        select: { id: true, name: true, email: true },
      },
      exercises: {
        include: { exercise: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!prescription) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prescription);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await verifyOwnership(params.id, session.user.id, session.user.role);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const data = await request.json();

    const prescription = await prisma.$transaction(async (tx) => {
      await tx.prescription.update({
        where: { id: params.id },
        data: {
          name: data.name,
          notes: data.notes || null,
          status: data.status || existing.status,
          patientId: data.patientId || existing.patientId,
        },
      });

      // Delete all existing exercises and recreate
      await tx.prescriptionExercise.deleteMany({
        where: { prescriptionId: params.id },
      });

      if (data.exercises && data.exercises.length > 0) {
        await tx.prescriptionExercise.createMany({
          data: data.exercises.map(
            (ex: {
              exerciseId: string;
              sets?: number;
              reps?: number;
              hold?: number;
              rest?: number;
              frequency?: string;
              notes?: string;
              orderIndex: number;
            }) => ({
              prescriptionId: params.id,
              exerciseId: ex.exerciseId,
              sets: ex.sets ?? null,
              reps: ex.reps ?? null,
              hold: ex.hold ?? null,
              rest: ex.rest ?? null,
              frequency: ex.frequency || null,
              notes: ex.notes || null,
              orderIndex: ex.orderIndex,
            })
          ),
        });
      }

      return tx.prescription.findUnique({
        where: { id: params.id },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          exercises: {
            include: { exercise: true },
            orderBy: { orderIndex: "asc" },
          },
        },
      });
    });

    return NextResponse.json(prescription);
  } catch {
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await verifyOwnership(params.id, session.user.id, session.user.role);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.prescription.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await verifyOwnership(params.id, session.user.id, session.user.role);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const { status } = await request.json();

    if (status !== "active" && status !== "completed") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const prescription = await prisma.prescription.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(prescription);
  } catch {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
