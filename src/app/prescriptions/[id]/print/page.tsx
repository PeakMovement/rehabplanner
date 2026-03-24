"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";

interface PrescriptionPrint {
  id: string;
  name: string;
  notes: string | null;
  status: string;
  createdAt: string;
  patient: { firstName: string; lastName: string };
  clinician: { name: string };
  exercises: {
    id: string;
    orderIndex: number;
    sets: number | null;
    reps: number | null;
    hold: number | null;
    rest: number | null;
    frequency: string | null;
    notes: string | null;
    exercise: {
      name: string;
      instructions: string | null;
    };
  }[];
}

export default function PrintPrescriptionPage() {
  const params = useParams();
  const [prescription, setPrescription] = useState<PrescriptionPrint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prescriptions/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrescription(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!prescription) {
    return <div className="p-8 text-gray-500">Prescription not found</div>;
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          nav {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>

      <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen">
        <div className="no-print mb-6">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Prescription
          </button>
        </div>

        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">RehabPrescriber</h1>
          <p className="text-sm text-gray-600 mt-1">Exercise Prescription</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Patient:</span>{" "}
            <span className="text-gray-900">
              {prescription.patient.firstName} {prescription.patient.lastName}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            <span className="text-gray-900">
              {new Date(prescription.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Clinician:</span>{" "}
            <span className="text-gray-900">{prescription.clinician.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Program:</span>{" "}
            <span className="text-gray-900">{prescription.name}</span>
          </div>
        </div>

        {prescription.notes && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
            <span className="font-semibold">Notes:</span> {prescription.notes}
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 pr-2 font-semibold text-gray-900 w-8">#</th>
              <th className="text-left py-2 pr-2 font-semibold text-gray-900">Exercise</th>
              <th className="text-left py-2 pr-2 font-semibold text-gray-900">Instructions</th>
              <th className="text-center py-2 pr-2 font-semibold text-gray-900 w-12">Sets</th>
              <th className="text-center py-2 pr-2 font-semibold text-gray-900 w-12">Reps</th>
              <th className="text-center py-2 pr-2 font-semibold text-gray-900 w-12">Hold</th>
              <th className="text-center py-2 pr-2 font-semibold text-gray-900 w-12">Rest</th>
              <th className="text-left py-2 pr-2 font-semibold text-gray-900">Freq.</th>
              <th className="text-left py-2 font-semibold text-gray-900">Notes</th>
            </tr>
          </thead>
          <tbody>
            {prescription.exercises.map((pe, index) => (
              <tr key={pe.id} className="border-b border-gray-300">
                <td className="py-2 pr-2 text-gray-600 align-top">{index + 1}</td>
                <td className="py-2 pr-2 font-medium text-gray-900 align-top">
                  {pe.exercise.name}
                </td>
                <td className="py-2 pr-2 text-gray-600 align-top text-xs max-w-[200px]">
                  {pe.exercise.instructions || "-"}
                </td>
                <td className="py-2 pr-2 text-center text-gray-900 align-top">
                  {pe.sets ?? "-"}
                </td>
                <td className="py-2 pr-2 text-center text-gray-900 align-top">
                  {pe.reps ?? "-"}
                </td>
                <td className="py-2 pr-2 text-center text-gray-900 align-top">
                  {pe.hold ? `${pe.hold}s` : "-"}
                </td>
                <td className="py-2 pr-2 text-center text-gray-900 align-top">
                  {pe.rest ? `${pe.rest}s` : "-"}
                </td>
                <td className="py-2 pr-2 text-gray-600 align-top text-xs">
                  {pe.frequency || "-"}
                </td>
                <td className="py-2 text-gray-600 align-top text-xs">
                  {pe.notes || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Generated by RehabPrescriber</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
