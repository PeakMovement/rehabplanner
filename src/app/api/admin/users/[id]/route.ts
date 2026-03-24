import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = params.id;

  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 403 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newRole = existingUser.role === "admin" ? "clinician" : "admin";

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(updatedUser);
}
