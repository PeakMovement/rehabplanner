"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Save,
  Check,
  Dumbbell,
  HelpCircle,
  Star,
} from "lucide-react";
import {
  generateProtocol,
  type GeneratedProtocol,
  type Treatment,
  type Profession,
} from "@/lib/protocol-engine";

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

const MODALITY_COLORS: Record<string, string> = {
  "Cryotherapy / Icing": "bg-cyan-50 border-cyan-200 text-cyan-800",
  "Heat Therapy": "bg-orange-50 border-orange-200 text-orange-800",
  "Deep Tissue Massage / Manual Therapy": "bg-purple-50 border-purple-200 text-purple-800",
  "Dry Needling": "bg-red-50 border-red-200 text-red-800",
  "Shockwave Therapy (ESWT)": "bg-yellow-50 border-yellow-200 text-yellow-800",
  "Bioflex Laser Therapy": "bg-green-50 border-green-200 text-green-800",
  "TENS (Transcutaneous Electrical Nerve Stimulation)": "bg-indigo-50 border-indigo-200 text-indigo-800",
  "Therapeutic Ultrasound": "bg-blue-50 border-blue-200 text-blue-800",
  "Taping / Bracing": "bg-gray-50 border-gray-300 text-gray-800",
  "Stretching Program": "bg-lime-50 border-lime-200 text-lime-800",
  "Rehabilitation Exercises": "bg-emerald-50 border-emerald-200 text-emerald-800",
};

export default function HippocratesPage() {
  const { data: session } = useSession();
  const profession = (session?.user?.profession || "physiotherapist") as Profession;
  const isBio = profession === "biokineticist";

  const [conditionSearch, setConditionSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false);

  const [moi, setMoi] = useState("");
  const [duration, setDuration] = useState("");
  const [acuity, setAcuity] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<number>>(new Set());

  const protocolRef = useRef<HTMLDivElement>(null);

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

  function toggleTreatmentExpand(index: number) {
    setExpandedTreatments((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
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
    setProtocol(null);
    setSaved(false);
    setExpandedTreatments(new Set());
  }

  function handleGenerate() {
    const result = generateProtocol({
      condition: selectedCondition || undefined,
      moi: moi || undefined,
      duration: duration || undefined,
      acuity: acuity || undefined,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      notes: additionalNotes || undefined,
      profession,
    });
    setProtocol(result);
    setSaved(false);
    // Expand all treatments by default
    setExpandedTreatments(new Set(result.treatments.map((_, i) => i)));
    // Scroll to protocol
    setTimeout(() => {
      protocolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function handleSave() {
    if (!protocol) return;
    setSaving(true);
    try {
      const res = await fetch("/api/protocols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: protocol.name,
          condition: selectedCondition || null,
          moi: moi || null,
          duration: duration || null,
          acuity: acuity || null,
          symptoms: selectedSymptoms,
          notes: additionalNotes || null,
          treatments: protocol.treatments,
        }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        alert("Failed to save protocol");
      }
    } catch {
      alert("Failed to save protocol");
    } finally {
      setSaving(false);
    }
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Hippocrates</h1>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isBio
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isBio ? "Biokinetics" : "Physiotherapy"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isBio
              ? "Exercise-based rehabilitation protocol generator"
              : "Clinical assessment and treatment protocol generator"}
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

            {!selectedCondition && (
              <Link
                href="/patients/differential"
                className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors w-full justify-center"
              >
                <HelpCircle className="w-4 h-4" />
                I don&apos;t know — help me identify the condition
              </Link>
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

      {/* Generate Protocol Button */}
      {hasAnyInput && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            Generate Treatment Protocol
          </button>
        </div>
      )}

      {/* Generated Protocol */}
      {protocol && (
        <div ref={protocolRef}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {protocol.name}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {protocol.treatments.length} treatment modalities recommended
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Protocol
                </>
              )}
            </button>
          </div>

          {/* Top Suggested */}
          {protocol.topSuggested.length > 0 && (
            <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-amber-900 text-sm">
                  Top Suggested Treatments
                </h3>
              </div>
              <div className="space-y-2.5">
                {protocol.topSuggested.map((ts, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/70 rounded-md px-4 py-3 border border-amber-100"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {ts.modality}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {ts.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {protocol.treatments.map((treatment: Treatment, index: number) => {
              const isExpanded = expandedTreatments.has(index);
              const colorClass =
                MODALITY_COLORS[treatment.modality] ||
                "bg-gray-50 border-gray-200 text-gray-800";
              const isRehab = treatment.modality === "Rehabilitation Exercises";

              return (
                <div
                  key={index}
                  className={`rounded-lg border ${colorClass}`}
                >
                  <button
                    onClick={() => toggleTreatmentExpand(index)}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      {isRehab && <Dumbbell className="w-5 h-5 flex-shrink-0" />}
                      <div className="text-left">
                        <h3 className="font-semibold text-sm">
                          {treatment.modality}
                        </h3>
                        {!isExpanded && (
                          <p className="text-xs opacity-75 mt-0.5">
                            {treatment.frequency} &middot; {treatment.duration}
                          </p>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-3">
                      <p className="text-sm opacity-90">
                        {treatment.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 rounded-md px-3 py-2">
                          <p className="text-xs font-medium opacity-60 uppercase tracking-wider">
                            Frequency
                          </p>
                          <p className="text-sm font-medium mt-0.5">
                            {treatment.frequency}
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-md px-3 py-2">
                          <p className="text-xs font-medium opacity-60 uppercase tracking-wider">
                            Duration
                          </p>
                          <p className="text-sm font-medium mt-0.5">
                            {treatment.duration}
                          </p>
                        </div>
                      </div>

                      {treatment.notes && (
                        <div className="bg-white/60 rounded-md px-3 py-2">
                          <p className="text-xs font-medium opacity-60 uppercase tracking-wider">
                            Clinical Notes
                          </p>
                          <p className="text-sm mt-0.5">{treatment.notes}</p>
                        </div>
                      )}

                      {/* Rehab Exercises Table */}
                      {isRehab && treatment.exercises && treatment.exercises.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                            Prescribed Exercises
                          </p>
                          <div className="bg-white rounded-lg border border-emerald-200 overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-emerald-50/50 border-b border-emerald-100">
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-emerald-700">
                                    Exercise
                                  </th>
                                  <th className="text-center px-3 py-2 text-xs font-semibold text-emerald-700 w-20">
                                    Sets
                                  </th>
                                  <th className="text-center px-3 py-2 text-xs font-semibold text-emerald-700 w-28">
                                    Reps
                                  </th>
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-emerald-700 hidden sm:table-cell">
                                    Notes
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-emerald-50">
                                {treatment.exercises.map((ex, exIdx) => (
                                  <tr
                                    key={exIdx}
                                    className="hover:bg-emerald-50/30"
                                  >
                                    <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                                      {ex.name}
                                    </td>
                                    <td className="px-3 py-2.5 text-sm text-center text-gray-700">
                                      {ex.sets}
                                    </td>
                                    <td className="px-3 py-2.5 text-sm text-center text-gray-700">
                                      {ex.reps}
                                    </td>
                                    <td className="px-3 py-2.5 text-xs text-gray-500 hidden sm:table-cell">
                                      {ex.notes || "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
