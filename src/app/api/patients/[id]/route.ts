import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-helpers";

async function verifyOwnership(patientId: string, userId: string, role: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) return { error: "Patient not found", status: 404 };
  if (role !== "admin" && patient.clinicianId !== userId) {
    return { error: "Forbidden", status: 403 };
  }

  return { patient };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      prescriptions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && patient.clinicianId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(patient);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const result = await verifyOwnership(id, session.user.id, session.user.role);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, dateOfBirth, diagnosis, notes } =
      body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth || null,
        }),
        ...(diagnosis !== undefined && { diagnosis: diagnosis || null }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Failed to update patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const result = await verifyOwnership(id, session.user.id, session.user.role);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ message: "Patient deleted" });
  } catch (error) {
    console.error("Failed to delete patient:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
