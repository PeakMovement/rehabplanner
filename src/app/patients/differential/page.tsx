"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  generateDifferentials,
  type DifferentialResult,
} from "@/lib/differential-engine";

const BODY_LOCATIONS = [
  "Shoulder",
  "Knee",
  "Hip",
  "Ankle",
  "Foot",
  "Neck",
  "Lower Back",
  "Upper Back",
  "Elbow",
  "Wrist / Hand",
  "Head",
  "Other",
];

const COMMON_SYMPTOMS = [
  "Pain at rest",
  "Pain with movement",
  "Sharp pain",
  "Dull ache",
  "Stiffness",
  "Swelling",
  "Weakness",
  "Instability / giving way",
  "Locking / catching",
  "Clicking / popping",
  "Numbness / tingling",
  "Radiating pain",
  "Morning stiffness",
  "Pain at night",
  "Bruising",
  "Muscle spasm",
  "Loss of range of motion",
  "Difficulty weight-bearing",
];

const COMMON_AGGRAVATING = [
  "Walking",
  "Running",
  "Stairs",
  "Sitting",
  "Standing",
  "Bending forward",
  "Reaching overhead",
  "Lifting",
  "Twisting",
  "Gripping",
  "Lying on affected side",
  "First steps in morning",
  "Coughing / sneezing",
  "Driving",
];

const COMMON_EASING = [
  "Rest",
  "Ice",
  "Heat",
  "Gentle movement",
  "Changing position",
  "Lying down",
  "Walking",
  "Stretching",
  "Support / bracing",
  "Medication",
];

export default function DifferentialPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <DifferentialContent />
    </Suspense>
  );
}

function DifferentialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientFirstName = searchParams.get("firstName") || "";
  const patientLastName = searchParams.get("lastName") || "";
  const returnParams = searchParams.toString();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedAggravating, setSelectedAggravating] = useState<string[]>([]);
  const [selectedEasing, setSelectedEasing] = useState<string[]>([]);
  const [results, setResults] = useState<{
    differentials: DifferentialResult[];
    generalRedFlags: string[];
  } | null>(null);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");

  function toggleItem(
    list: string[],
    setter: (v: string[]) => void,
    item: string
  ) {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  function toggleExpand(index: number) {
    setExpandedResults((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleGenerate() {
    const result = generateDifferentials({
      location,
      description,
      symptoms: selectedSymptoms,
      aggravating: selectedAggravating,
      easing: selectedEasing,
    });
    setResults(result);
    setExpandedResults(new Set(result.differentials.map((_, i) => i)));
    setSelectedDiagnosis("");
  }

  function handleUseDiagnosis(diagnosis: string) {
    setSelectedDiagnosis(diagnosis);
  }

  function handleConfirmAndReturn() {
    const params = new URLSearchParams();
    if (patientFirstName) params.set("firstName", patientFirstName);
    if (patientLastName) params.set("lastName", patientLastName);
    // Pass back all original params plus the diagnosis
    const originalParams = new URLSearchParams(returnParams);
    originalParams.forEach((value, key) => {
      if (key !== "diagnosis") params.set(key, value);
    });
    params.set("diagnosis", selectedDiagnosis);
    router.push(`/patients/new?${params.toString()}`);
  }

  const hasInput = location || description || selectedSymptoms.length > 0;

  const confidenceColor: Record<string, string> = {
    High: "bg-green-100 text-green-800 border-green-200",
    Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const confidenceBorder: Record<string, string> = {
    High: "border-l-green-500",
    Moderate: "border-l-yellow-500",
    Low: "border-l-gray-400",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/patients/new"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Add Patient
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Differential Diagnosis
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {patientFirstName
            ? `Describe ${patientFirstName}'s presentation and we'll suggest possible diagnoses`
            : "Describe the patient's presentation and we'll suggest possible diagnoses"}
        </p>
      </div>

      {/* Step 1: Location */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Where is the primary complaint?
        </label>
        <div className="flex flex-wrap gap-2">
          {BODY_LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(location === loc ? "" : loc)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                location === loc
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Describe the condition in your own words
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Include how it started, what it feels like, how long they&apos;ve had it, and
          anything notable about the history.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="e.g., Patient reports gradual onset right shoulder pain over the past 3 months. Worse when reaching overhead or behind their back. No trauma. Disturbs sleep when lying on that side. Reports feeling of weakness when lifting objects..."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Step 3: Symptoms */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Select reported symptoms
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() =>
                toggleItem(selectedSymptoms, setSelectedSymptoms, s)
              }
              className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                selectedSymptoms.includes(s)
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Aggravating */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          What makes it worse?
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_AGGRAVATING.map((a) => (
            <button
              key={a}
              onClick={() =>
                toggleItem(selectedAggravating, setSelectedAggravating, a)
              }
              className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                selectedAggravating.includes(a)
                  ? "border-red-400 bg-red-50 text-red-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Step 5: Easing */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          What makes it better?
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_EASING.map((e) => (
            <button
              key={e}
              onClick={() => toggleItem(selectedEasing, setSelectedEasing, e)}
              className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                selectedEasing.includes(e)
                  ? "border-green-400 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {hasInput && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            Generate Differential Diagnoses
          </button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mb-8">
          {/* Red Flags */}
          {results.generalRedFlags.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Red Flags Detected</h3>
              </div>
              <ul className="space-y-1">
                {results.generalRedFlags.map((flag, i) => (
                  <li key={i} className="text-sm text-red-700">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Possible Diagnoses ({results.differentials.length})
          </h2>

          {results.differentials.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm">
                Could not determine a likely diagnosis from the information
                provided. Please add more detail to the description or select
                more symptoms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.differentials.map((diff, index) => {
                const isExpanded = expandedResults.has(index);
                const isSelected = selectedDiagnosis === diff.condition;

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-lg border border-l-4 ${
                      confidenceBorder[diff.confidence]
                    } ${
                      isSelected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(index)}
                      className="w-full flex items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {diff.condition}
                            </h3>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                confidenceColor[diff.confidence]
                              }`}
                            >
                              {diff.confidence}
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          {!isExpanded && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {diff.reasoning}
                            </p>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-4 space-y-3">
                        <p className="text-sm text-gray-700">
                          {diff.reasoning}
                        </p>

                        {diff.keyIndicators.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Matched Indicators
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {diff.keyIndicators.map((ind, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                                >
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {diff.redFlags && diff.redFlags.length > 0 && (
                          <div className="bg-red-50 rounded-md p-3">
                            <p className="text-xs font-medium text-red-700">
                              {diff.redFlags.join(" ")}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => handleUseDiagnosis(diff.condition)}
                          className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {isSelected ? "Selected" : "Use this diagnosis"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm and return */}
          {selectedDiagnosis && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Selected: {selectedDiagnosis}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  This will be set as the patient&apos;s diagnosis
                </p>
              </div>
              <button
                onClick={handleConfirmAndReturn}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
