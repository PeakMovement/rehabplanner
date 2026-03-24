import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Plus, Eye, Edit, ClipboardList } from "lucide-react";
import { DeletePrescriptionButton } from "./delete-button";

export default async function PrescriptionsPage() {
  const session = await requireAuth();

  const isAdmin = session.user.role === "admin";

  const prescriptions = await prisma.prescription.findMany({
    where: !isAdmin ? { clinicianId: session.user.id } : {},
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <Link
          href="/prescriptions/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Prescription
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No prescriptions yet</p>
          <Link href="/prescriptions/new" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Create your first prescription
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Exercises</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/prescriptions/${rx.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {rx.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <Link href={`/patients/${rx.patient.id}`} className="hover:underline">
                      {rx.patient.firstName} {rx.patient.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {rx._count.exercises}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        rx.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/prescriptions/${rx.id}`} className="text-gray-400 hover:text-blue-600" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/prescriptions/${rx.id}/edit`} className="text-gray-400 hover:text-gray-600" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePrescriptionButton id={rx.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
