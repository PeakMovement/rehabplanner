"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Dumbbell,
} from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface Exercise {
  id: string;
  name: string;
  bodyRegion: string;
  category: string;
  difficulty: string | null;
  equipment: string | null;
  instructions: string | null;
  defaultSets: number | null;
  defaultReps: number | null;
  defaultHold: number | null;
  defaultRest: number | null;
  imageUrl: string | null;
  notes: string | null;
}

interface PrescriptionExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number | null;
  reps: number | null;
  hold: number | null;
  rest: number | null;
  frequency: string;
  notes: string;
  orderIndex: number;
}

export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <NewPrescriptionContent />
    </Suspense>
  );
}

function NewPrescriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<PrescriptionExercise[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [saving, setSaving] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  function addExercise(exercise: Exercise) {
    const newEx: PrescriptionExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      hold: exercise.defaultHold,
      rest: exercise.defaultRest,
      frequency: "",
      notes: "",
      orderIndex: exercises.length,
    };
    setExercises((prev) => [...prev, newEx]);
    setShowExerciseModal(false);
  }

  function updateExercise(index: number, field: string, value: string | number | null) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  function removeExercise(index: number) {
    setExercises((prev) =>
      prev.filter((_, i) => i !== index).map((ex, i) => ({ ...ex, orderIndex: i }))
    );
  }

  function moveExercise(index: number, direction: "up" | "down") {
    const newExercises = [...exercises];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newExercises.length) return;
    [newExercises[index], newExercises[swapIndex]] = [
      newExercises[swapIndex],
      newExercises[index],
    ];
    setExercises(newExercises.map((ex, i) => ({ ...ex, orderIndex: i })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !patientId) return;

    setSaving(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          notes,
          patientId,
          status: "active",
          exercises: exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            hold: ex.hold,
            rest: ex.rest,
            frequency: ex.frequency || null,
            notes: ex.notes || null,
            orderIndex: ex.orderIndex,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/prescriptions/${data.id}`);
      } else {
        alert("Failed to create prescription");
      }
    } catch {
      alert("Failed to create prescription");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/prescriptions"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        New Prescription
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescription Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Shoulder Rehab Phase 1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="General instructions or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Exercises ({exercises.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowExerciseModal(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No exercises added yet</p>
            <button
              type="button"
              onClick={() => setShowExerciseModal(true)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              Browse exercise library
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((ex, index) => (
              <div
                key={`${ex.exerciseId}-${index}`}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {index + 1}. {ex.exercise.name}
                    </h3>
                    <p className="text-xs text-gray-500">{ex.exercise.bodyRegion} &middot; {ex.exercise.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveExercise(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExercise(index, "down")}
                      disabled={index === exercises.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-1 text-gray-400 hover:text-red-600 ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sets</label>
                    <input
                      type="number"
                      min={0}
                      value={ex.sets ?? ""}
                      onChange={(e) =>
                        updateExercise(index, "sets", e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reps</label>
                    <input
                      type="number"
                      min={0}
                      value={ex.reps ?? ""}
                      onChange={(e) =>
                        updateExercise(index, "reps", e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hold (sec)</label>
                    <input
                      type="number"
                      min={0}
                      value={ex.hold ?? ""}
                      onChange={(e) =>
                        updateExercise(index, "hold", e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                    <input
                      type="number"
                      min={0}
                      value={ex.rest ?? ""}
                      onChange={(e) =>
                        updateExercise(index, "rest", e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={ex.frequency}
                      onChange={(e) => updateExercise(index, "frequency", e.target.value)}
                      placeholder="e.g., 3x/week"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <input
                    type="text"
                    value={ex.notes}
                    onChange={(e) => updateExercise(index, "notes", e.target.value)}
                    placeholder="Special instructions for this exercise..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6 gap-3">
          <Link
            href="/prescriptions"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !name || !patientId}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </form>

      {showExerciseModal && (
        <ExerciseLibraryModal
          onSelect={addExercise}
          onClose={() => setShowExerciseModal(false)}
          addedExerciseIds={exercises.map((e) => e.exerciseId)}
        />
      )}
    </div>
  );
}

function ExerciseLibraryModal({
  onSelect,
  onClose,
  addedExerciseIds,
}: {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  addedExerciseIds: string[];
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bodyRegionFilter, setBodyRegionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      });
  }, []);

  const bodyRegions = Array.from(new Set(exercises.map((e: { bodyRegion: string }) => e.bodyRegion))).sort();
  const categories = Array.from(new Set(exercises.map((e: { category: string }) => e.category))).sort();

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      !search ||
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.bodyRegion.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = !bodyRegionFilter || ex.bodyRegion === bodyRegionFilter;
    const matchesCategory = !categoryFilter || ex.category === categoryFilter;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Exercise Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <select
              value={bodyRegionFilter}
              onChange={(e) => setBodyRegionFilter(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Body Regions</option>
              {bodyRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading exercises...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No exercises found</div>
          ) : (
            <div className="space-y-1">
              {filtered.map((exercise) => {
                const alreadyAdded = addedExerciseIds.includes(exercise.id);
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => onSelect(exercise)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                      alreadyAdded ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{exercise.name}</span>
                        {alreadyAdded && (
                          <span className="ml-2 text-xs text-blue-600">(added)</span>
                        )}
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{exercise.bodyRegion}</span>
                      <span className="text-xs text-gray-400">&middot;</span>
                      <span className="text-xs text-gray-500">{exercise.category}</span>
                      {exercise.difficulty && (
                        <>
                          <span className="text-xs text-gray-400">&middot;</span>
                          <span className="text-xs text-gray-500">{exercise.difficulty}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
