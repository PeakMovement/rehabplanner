import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const protocols = await prisma.treatmentProtocol.findMany({
    where: { clinicianId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(protocols);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();

    const protocol = await prisma.treatmentProtocol.create({
      data: {
        name: data.name,
        condition: data.condition || null,
        moi: data.moi || null,
        duration: data.duration || null,
        acuity: data.acuity || null,
        symptoms: data.symptoms ? JSON.stringify(data.symptoms) : null,
        notes: data.notes || null,
        treatments: JSON.stringify(data.treatments),
        clinicianId: session.user.id,
      },
    });

    return NextResponse.json(protocol);
  } catch {
    return NextResponse.json({ error: "Failed to save protocol" }, { status: 500 });
  }
}
