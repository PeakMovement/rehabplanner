"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
