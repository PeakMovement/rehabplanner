"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, HelpCircle } from "lucide-react";

const DIAGNOSES = [
  "Rotator Cuff Tear",
  "Rotator Cuff Tendinopathy",
  "Frozen Shoulder (Adhesive Capsulitis)",
  "Shoulder Impingement",
  "Shoulder Instability / Dislocation",
  "Labral Tear (SLAP)",
  "AC Joint Sprain",
  "ACL Tear / Reconstruction",
  "MCL Sprain",
  "Meniscus Tear",
  "Patellofemoral Pain Syndrome",
  "Patellar Tendinopathy",
  "IT Band Syndrome",
  "Knee Osteoarthritis",
  "Total Knee Replacement",
  "Total Hip Replacement",
  "Hip Labral Tear",
  "Hip Impingement (FAI)",
  "Greater Trochanteric Pain Syndrome",
  "Hip Osteoarthritis",
  "Lateral Ankle Sprain",
  "Achilles Tendinopathy",
  "Plantar Fasciitis",
  "Ankle Fracture (Post-Op)",
  "Cervical Radiculopathy",
  "Cervical Strain / Whiplash",
  "Lumbar Disc Herniation",
  "Lumbar Spinal Stenosis",
  "Non-Specific Low Back Pain",
  "Spondylolisthesis",
  "Sciatica",
  "Thoracic Outlet Syndrome",
  "Tennis Elbow (Lateral Epicondylalgia)",
  "Golfer's Elbow (Medial Epicondylalgia)",
  "Carpal Tunnel Syndrome",
  "De Quervain's Tenosynovitis",
  "Post-Concussion Syndrome",
  "Muscle Strain (General)",
  "Ligament Sprain (General)",
  "Post-Surgical Rehabilitation (General)",
];

export default function NewPatientPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <NewPatientContent />
    </Suspense>
  );
}

function NewPatientContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    diagnosis: "",
    notes: "",
  });

  const [diagnosisSearch, setDiagnosisSearch] = useState("");
  const [diagnosisDropdownOpen, setDiagnosisDropdownOpen] = useState(false);

  // Pick up params from the differential diagnosis page or URL
  useEffect(() => {
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const diagnosis = searchParams.get("diagnosis");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    setForm((prev) => ({
      ...prev,
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(diagnosis ? { diagnosis } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    }));
  }, [searchParams]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectDiagnosis(d: string) {
    setForm((prev) => ({ ...prev, diagnosis: d }));
    setDiagnosisSearch("");
    setDiagnosisDropdownOpen(false);
  }

  function clearDiagnosis() {
    setForm((prev) => ({ ...prev, diagnosis: "" }));
    setDiagnosisSearch("");
  }

  function goToDifferential() {
    const params = new URLSearchParams();
    if (form.firstName) params.set("firstName", form.firstName);
    if (form.lastName) params.set("lastName", form.lastName);
    if (form.email) params.set("email", form.email);
    if (form.phone) params.set("phone", form.phone);
    router.push(`/patients/differential?${params.toString()}`);
  }

  const filteredDiagnoses = DIAGNOSES.filter((d) =>
    d.toLowerCase().includes(diagnosisSearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create patient");
      }

      router.push("/patients");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/patients"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Patients
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Add New Patient
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name (required) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact (optional) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Date of Birth (optional) */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth{" "}
            <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Diagnosis - searchable dropdown + Don't Know */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis{" "}
            <span className="text-xs text-gray-400">(optional)</span>
          </label>

          {form.diagnosis ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                {form.diagnosis}
                <button
                  type="button"
                  onClick={clearDiagnosis}
                  className="hover:text-blue-900 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          ) : (
            <>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search diagnoses..."
                  value={diagnosisSearch}
                  onChange={(e) => {
                    setDiagnosisSearch(e.target.value);
                    setDiagnosisDropdownOpen(true);
                  }}
                  onFocus={() => setDiagnosisDropdownOpen(true)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {diagnosisDropdownOpen && (
                <div className="mt-1 border border-gray-200 rounded-lg max-h-52 overflow-y-auto bg-white shadow-lg z-10 relative">
                  {filteredDiagnoses.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No matching diagnoses
                    </p>
                  ) : (
                    filteredDiagnoses.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => selectDiagnosis(d)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                      >
                        {d}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Don't Know button */}
              <button
                type="button"
                onClick={goToDifferential}
                className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors w-full justify-center"
              >
                <HelpCircle className="w-4 h-4" />
                I don&apos;t know the diagnosis — help me figure it out
              </button>
            </>
          )}
        </div>

        {/* Notes (optional) */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes{" "}
            <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this patient..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/patients"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}
