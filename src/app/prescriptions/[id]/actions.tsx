"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Printer, Copy, Trash2, CheckCircle, RotateCcw } from "lucide-react";

interface PrescriptionWithDetails {
  id: string;
  name: string;
  notes: string | null;
  status: string;
  patientId: string;
  patient: { id: string; firstName: string; lastName: string };
  exercises: {
    exerciseId: string;
    sets: number | null;
    reps: number | null;
    hold: number | null;
    rest: number | null;
    frequency: string | null;
    notes: string | null;
    orderIndex: number;
  }[];
}

export function PrescriptionActions({
  prescription,
}: {
  prescription: PrescriptionWithDetails;
}) {
  const router = useRouter();

  async function toggleStatus() {
    const newStatus = prescription.status === "active" ? "completed" : "active";
    await fetch(`/api/prescriptions/${prescription.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function duplicatePrescription() {
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${prescription.name} (Copy)`,
        notes: prescription.notes,
        patientId: prescription.patientId,
        status: "active",
        exercises: prescription.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          hold: ex.hold,
          rest: ex.rest,
          frequency: ex.frequency,
          notes: ex.notes,
          orderIndex: ex.orderIndex,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/prescriptions/${data.id}`);
    }
  }

  async function deletePrescription() {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    await fetch(`/api/prescriptions/${prescription.id}`, { method: "DELETE" });
    router.push("/prescriptions");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/prescriptions/${prescription.id}/edit`}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50"
      >
        <Edit className="w-4 h-4" />
        Edit
      </Link>
      <Link
        href={`/prescriptions/${prescription.id}/print`}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50"
      >
        <Printer className="w-4 h-4" />
        Print
      </Link>
      <button
        onClick={toggleStatus}
        className={`flex items-center gap-1 text-sm border px-3 py-1.5 rounded-md hover:bg-gray-50 ${
          prescription.status === "active"
            ? "text-green-700 border-green-300 hover:bg-green-50"
            : "text-blue-700 border-blue-300 hover:bg-blue-50"
        }`}
      >
        {prescription.status === "active" ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Mark Completed
          </>
        ) : (
          <>
            <RotateCcw className="w-4 h-4" />
            Reactivate
          </>
        )}
      </button>
      <button
        onClick={duplicatePrescription}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50"
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      <button
        onClick={deletePrescription}
        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 border border-red-300 px-3 py-1.5 rounded-md hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}
