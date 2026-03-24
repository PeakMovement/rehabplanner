import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const isAdmin = session.user.role === "admin";

  const where: Record<string, unknown> = {};

  if (!isAdmin) {
    where.clinicianId = session.user.id;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const patients = await prisma.patient.findMany({
      where,
      include: {
        _count: {
          select: { prescriptions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, dateOfBirth, diagnosis, notes } =
      body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        diagnosis: diagnosis || null,
        notes: notes || null,
        clinicianId: session.user.id,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error("Failed to create patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
