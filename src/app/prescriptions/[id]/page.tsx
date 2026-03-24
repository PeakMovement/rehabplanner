import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrescriptionActions } from "./actions";

export default async function PrescriptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

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
        select: { id: true, name: true },
      },
      exercises: {
        include: { exercise: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!prescription) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/prescriptions"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {prescription.name}
            </h1>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${
                prescription.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {prescription.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
            <span>
              Patient:{" "}
              <Link
                href={`/patients/${prescription.patient.id}`}
                className="text-blue-600 hover:underline"
              >
                {prescription.patient.firstName} {prescription.patient.lastName}
              </Link>
            </span>
            <span>Clinician: {prescription.clinician.name}</span>
            <span>
              Created: {new Date(prescription.createdAt).toLocaleDateString()}
            </span>
          </div>
          {prescription.notes && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-md p-3">
              {prescription.notes}
            </p>
          )}
        </div>

        <PrescriptionActions prescription={prescription} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">
            Exercises ({prescription.exercises.length})
          </h2>
        </div>
        {prescription.exercises.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No exercises in this prescription
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Exercise
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Sets
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Reps
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Hold
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Rest
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                    Frequency
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prescription.exercises.map((pe, index) => (
                  <tr key={pe.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {pe.exercise.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pe.exercise.bodyRegion}
                      </div>
                      {pe.exercise.instructions && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {pe.exercise.instructions}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pe.sets ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pe.reps ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pe.hold ? `${pe.hold}s` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pe.rest ? `${pe.rest}s` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      {pe.frequency || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell max-w-xs truncate">
                      {pe.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
