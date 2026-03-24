import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  const isAdmin = session.user.role === "admin";

  const prescriptions = await prisma.prescription.findMany({
    where: {
      ...(!isAdmin ? { clinicianId: session.user.id } : {}),
      ...(patientId ? { patientId } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true },
      },
      _count: {
        select: { exercises: true },
      },
    },
  });

  return NextResponse.json(prescriptions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();

    // Verify patient belongs to clinician
    const patient = await prisma.patient.findFirst({
      where: {
        id: data.patientId,
        clinicianId: session.user.id,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const prescription = await prisma.$transaction(async (tx) => {
      const rx = await tx.prescription.create({
        data: {
          name: data.name,
          notes: data.notes || null,
          status: data.status || "active",
          patientId: data.patientId,
          clinicianId: session.user.id,
        },
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
              prescriptionId: rx.id,
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
        where: { id: rx.id },
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
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}
