"use client";

import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

const CONDITIONS = [
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

const MOI_OPTIONS = [
  "Traumatic / Acute Injury",
  "Overuse / Repetitive Strain",
  "Insidious Onset",
  "Post-Surgical",
  "Fall",
  "Sport-Related Contact",
  "Sport-Related Non-Contact",
  "Motor Vehicle Accident",
  "Work-Related / Ergonomic",
  "Degenerative / Age-Related",
  "Unknown",
];

const SYMPTOMS = [
  "Pain at rest",
  "Pain with movement",
  "Pain at night",
  "Sharp pain",
  "Dull / aching pain",
  "Burning pain",
  "Radiating pain",
  "Stiffness",
  "Swelling",
  "Bruising",
  "Weakness",
  "Instability / giving way",
  "Locking / catching",
  "Clicking / popping",
  "Crepitus",
  "Numbness",
  "Tingling / pins and needles",
  "Loss of range of motion",
  "Difficulty weight-bearing",
  "Difficulty with overhead activities",
  "Difficulty gripping",
  "Difficulty sitting",
  "Difficulty standing",
  "Difficulty walking",
  "Difficulty sleeping",
  "Muscle spasm",
  "Fatigue / deconditioning",
  "Balance issues",
  "Headache",
  "Dizziness",
];

const DURATION_OPTIONS = [
  "< 1 week",
  "1-2 weeks",
  "2-4 weeks",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "> 12 months",
];

const ACUITY_OPTIONS = [
  { value: "acute", label: "Acute", desc: "0-2 weeks" },
  { value: "subacute", label: "Sub-Acute", desc: "2-6 weeks" },
  { value: "chronic", label: "Chronic", desc: "6+ weeks" },
  { value: "post-op", label: "Post-Op", desc: "Surgical recovery" },
  { value: "flare-up", label: "Flare-Up", desc: "Recurrence of symptoms" },
];

export default function HippocratesPage() {
  const [conditionSearch, setConditionSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false);

  const [moi, setMoi] = useState("");
  const [duration, setDuration] = useState("");
  const [acuity, setAcuity] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Sections collapsible state
  const [sectionsOpen, setSectionsOpen] = useState({
    condition: true,
    details: true,
    symptoms: true,
  });

  function toggleSection(section: keyof typeof sectionsOpen) {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }

  function clearAll() {
    setSelectedCondition("");
    setConditionSearch("");
    setMoi("");
    setDuration("");
    setAcuity("");
    setSelectedSymptoms([]);
    setSymptomSearch("");
    setAdditionalNotes("");
  }

  const filteredConditions = CONDITIONS.filter((c) =>
    c.toLowerCase().includes(conditionSearch.toLowerCase())
  );

  const filteredSymptoms = SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  const hasAnyInput =
    selectedCondition || moi || duration || acuity || selectedSymptoms.length > 0 || additionalNotes;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hippocrates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Clinical assessment and condition profiling
          </p>
        </div>
        {hasAnyInput && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Section 1: Condition */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <button
          onClick={() => toggleSection("condition")}
          className="w-full flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
              1
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Condition
            </h2>
            {selectedCondition && !sectionsOpen.condition && (
              <span className="text-sm text-blue-600 font-medium">
                {selectedCondition}
              </span>
            )}
          </div>
          {sectionsOpen.condition ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {sectionsOpen.condition && (
          <div className="px-6 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What condition are you treating?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conditions..."
                value={selectedCondition || conditionSearch}
                onChange={(e) => {
                  setConditionSearch(e.target.value);
                  setSelectedCondition("");
                  setConditionDropdownOpen(true);
                }}
                onFocus={() => setConditionDropdownOpen(true)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedCondition && (
                <button
                  onClick={() => {
                    setSelectedCondition("");
                    setConditionSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {conditionDropdownOpen && !selectedCondition && (
              <div className="mt-1 border border-gray-200 rounded-lg max-h-56 overflow-y-auto bg-white shadow-lg">
                {filteredConditions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No matching conditions
                  </p>
                ) : (
                  filteredConditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => {
                        setSelectedCondition(condition);
                        setConditionSearch("");
                        setConditionDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                    >
                      {condition}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Clinical Details */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <button
          onClick={() => toggleSection("details")}
          className="w-full flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
              2
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Clinical Details
            </h2>
          </div>
          {sectionsOpen.details ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {sectionsOpen.details && (
          <div className="px-6 pb-6 space-y-5">
            {/* MOI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mechanism of Injury (MOI)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOI_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setMoi(moi === option ? "" : option)}
                    className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                      moi === option
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration of Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(duration === option ? "" : option)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                      duration === option
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Acuity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acuity / Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {ACUITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setAcuity(acuity === option.value ? "" : option.value)
                    }
                    className={`px-3 py-3 rounded-lg border text-center transition-colors ${
                      acuity === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium ${
                        acuity === option.value
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {option.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Aggravating factors, relevant history, imaging findings..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Symptoms */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <button
          onClick={() => toggleSection("symptoms")}
          className="w-full flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
              3
            </span>
            <h2 className="text-lg font-semibold text-gray-900">Symptoms</h2>
            {selectedSymptoms.length > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {selectedSymptoms.length} selected
              </span>
            )}
          </div>
          {sectionsOpen.symptoms ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {sectionsOpen.symptoms && (
          <div className="px-6 pb-6">
            {/* Selected symptoms pills */}
            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {symptom}
                    <button
                      onClick={() => toggleSymptom(symptom)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search symptoms */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Symptom checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-64 overflow-y-auto">
              {filteredSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {hasAnyInput && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Summary
          </h3>
          <div className="space-y-2 text-sm">
            {selectedCondition && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  Condition:
                </span>
                <span className="text-gray-900">{selectedCondition}</span>
              </div>
            )}
            {moi && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  MOI:
                </span>
                <span className="text-gray-900">{moi}</span>
              </div>
            )}
            {duration && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  Duration:
                </span>
                <span className="text-gray-900">{duration}</span>
              </div>
            )}
            {acuity && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  Acuity:
                </span>
                <span className="text-gray-900 capitalize">{acuity}</span>
              </div>
            )}
            {selectedSymptoms.length > 0 && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  Symptoms:
                </span>
                <span className="text-gray-900">
                  {selectedSymptoms.join(", ")}
                </span>
              </div>
            )}
            {additionalNotes && (
              <div className="flex gap-2">
                <span className="font-medium text-gray-500 w-28 flex-shrink-0">
                  Notes:
                </span>
                <span className="text-gray-900">{additionalNotes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
