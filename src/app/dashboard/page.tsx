import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Users, Stethoscope } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireAuth();
  const isAdmin = session.user.role === "admin";

  const [totalPatients, totalProtocols, recentPatients] =
    await Promise.all([
      prisma.patient.count(
        isAdmin ? undefined : { where: { clinicianId: session.user.id } }
      ),
      prisma.treatmentProtocol.count(
        isAdmin ? undefined : { where: { clinicianId: session.user.id } }
      ),
      prisma.patient.findMany({
        where: isAdmin ? {} : { clinicianId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Saved Protocols",
      value: totalProtocols,
      icon: Stethoscope,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome back, {session.user.name}
          {isAdmin && (
            <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Admin
            </span>
          )}
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`${stat.color} p-3 rounded-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Patients
            </h2>
            <Link
              href="/patients"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPatients.length === 0 ? (
              <p className="px-6 py-4 text-gray-500 text-sm">
                No patients yet.
              </p>
            ) : (
              recentPatients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/patients/${patient.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      {patient.diagnosis && (
                        <p className="text-sm text-gray-500">
                          {patient.diagnosis}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
