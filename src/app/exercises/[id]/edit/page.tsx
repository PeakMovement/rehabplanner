"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const BODY_REGIONS = [
  "Shoulder",
  "Knee",
  "Hip",
  "Ankle",
  "Spine",
  "Elbow",
  "Wrist",
  "Neck",
  "Core",
  "Full Body",
];

const CATEGORIES = [
  "Strength",
  "Mobility",
  "ROM",
  "Balance",
  "Functional",
  "Stretching",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function EditExercisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    bodyRegion: "Shoulder",
    category: "Strength",
    difficulty: "Beginner",
    equipment: "",
    instructions: "",
    defaultSets: "",
    defaultReps: "",
    defaultHold: "",
    defaultRest: "",
    imageUrl: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchExercise() {
      try {
        const res = await fetch(`/api/exercises/${id}`);
        if (!res.ok) {
          setError("Failed to load exercise.");
          return;
        }
        const data = await res.json();
        setForm({
          name: data.name || "",
          bodyRegion: data.bodyRegion || "Shoulder",
          category: data.category || "Strength",
          difficulty: data.difficulty || "Beginner",
          equipment: data.equipment || "",
          instructions: data.instructions || "",
          defaultSets: data.defaultSets?.toString() || "",
          defaultReps: data.defaultReps?.toString() || "",
          defaultHold: data.defaultHold?.toString() || "",
          defaultRest: data.defaultRest?.toString() || "",
          imageUrl: data.imageUrl || "",
          notes: data.notes || "",
        });
      } catch {
        setError("An unexpected error occurred while loading the exercise.");
      } finally {
        setFetching(false);
      }
    }

    fetchExercise();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/exercises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 403) {
        setError("You do not have permission to edit exercises.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update exercise.");
        return;
      }

      router.push("/exercises");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading exercise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/exercises"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            &larr; Back to Exercises
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Edit Exercise
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the details for this rehabilitation exercise.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Exercise Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Body Region, Category, Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="bodyRegion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Body Region <span className="text-red-500">*</span>
              </label>
              <select
                id="bodyRegion"
                name="bodyRegion"
                required
                value={form.bodyRegion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                {BODY_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label
              htmlFor="equipment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Equipment
            </label>
            <input
              type="text"
              id="equipment"
              name="equipment"
              value={form.equipment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              id="instructions"
              name="instructions"
              required
              rows={4}
              value={form.instructions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-vertical"
            />
          </div>

          {/* Sets, Reps, Hold, Rest */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="defaultSets"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Sets
              </label>
              <input
                type="number"
                id="defaultSets"
                name="defaultSets"
                min="0"
                value={form.defaultSets}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="defaultReps"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Reps
              </label>
              <input
                type="number"
                id="defaultReps"
                name="defaultReps"
                min="0"
                value={form.defaultReps}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="defaultHold"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hold (seconds)
              </label>
              <input
                type="number"
                id="defaultHold"
                name="defaultHold"
                min="0"
                value={form.defaultHold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="defaultRest"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rest (seconds)
              </label>
              <input
                type="number"
                id="defaultRest"
                name="defaultRest"
                min="0"
                value={form.defaultRest}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-vertical"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/exercises"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
