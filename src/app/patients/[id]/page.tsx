"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, ClipboardList } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  diagnosis: string | null;
  notes: string | null;
  createdAt: string;
  prescriptions: {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    _count: { exercises: number };
  }[];
}

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Loading...</div>;
  if (!patient) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Patient not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/patients" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Added {new Date(patient.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href={`/patients/${patient.id}/edit`}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Contact Info</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Email:</span> <span className="ml-2">{patient.email || "-"}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="ml-2">{patient.phone || "-"}</span></div>
            <div><span className="text-gray-500">Date of Birth:</span> <span className="ml-2">{patient.dateOfBirth || "-"}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Clinical Info</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Diagnosis:</span> <span className="ml-2">{patient.diagnosis || "-"}</span></div>
            <div><span className="text-gray-500">Notes:</span> <span className="ml-2">{patient.notes || "-"}</span></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Prescriptions</h2>
        <Link
          href={`/prescriptions/new?patientId=${patient.id}`}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Prescription
        </Link>
      </div>

      {patient.prescriptions.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No prescriptions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Exercises</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patient.prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/prescriptions/${rx.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {rx.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${rx.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{rx._count.exercises}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(rx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
