import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-helpers";
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

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "Advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const bodyRegion =
    typeof searchParams.bodyRegion === "string"
      ? searchParams.bodyRegion
      : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const difficulty =
    typeof searchParams.difficulty === "string"
      ? searchParams.difficulty
      : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { instructions: { contains: search, mode: "insensitive" } },
      { equipment: { contains: search, mode: "insensitive" } },
    ];
  }

  if (bodyRegion) {
    where.bodyRegion = bodyRegion;
  }

  if (category) {
    where.category = category;
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Exercise Library
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse and manage rehabilitation exercises
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/exercises/new"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Exercise
            </Link>
          )}
        </div>

        {/* Filters */}
        <form method="GET" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                defaultValue={search || ""}
                placeholder="Search exercises..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="bodyRegion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Body Region
              </label>
              <select
                id="bodyRegion"
                name="bodyRegion"
                defaultValue={bodyRegion || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                <option value="">All Regions</option>
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
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                <option value="">All Categories</option>
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
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue={difficulty || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                <option value="">All Difficulties</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <Link
              href="/exercises"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </Link>
          </div>
        </form>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} found
        </p>

        {/* Exercise Grid */}
        {exercises.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No exercises found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {exercise.name}
                  </h3>
                  {isAdmin && (
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <Link
                        href={`/exercises/${exercise.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit exercise"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <form
                        action={`/api/exercises/${exercise.id}`}
                        method="POST"
                      >
                        <button
                          type="button"
                          onClick={`if(confirm('Delete this exercise?')){fetch('/api/exercises/${exercise.id}',{method:'DELETE'}).then(()=>location.reload())}` as unknown as undefined}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete exercise"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {exercise.bodyRegion}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {exercise.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Equipment */}
                {exercise.equipment && (
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg
                      className="w-4 h-4 mr-1.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    {exercise.equipment}
                  </div>
                )}

                {/* Sets/Reps info */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {exercise.defaultSets && (
                    <span>{exercise.defaultSets} sets</span>
                  )}
                  {exercise.defaultReps && (
                    <span>{exercise.defaultReps} reps</span>
                  )}
                  {exercise.defaultHold && (
                    <span>{exercise.defaultHold}s hold</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
