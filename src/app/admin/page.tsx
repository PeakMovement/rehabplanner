import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Users, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await requireAdmin();

  const [users, totalUsers, totalPrescriptions] =
    await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              patients: true,
              prescriptions: true,
            },
          },
        },
      }),
      prisma.user.count(),
      prisma.prescription.count(),
    ]);

  const systemStats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    {
      label: "Total Prescriptions",
      value: totalPrescriptions,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users and system settings
            </p>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {systemStats.map((stat) => {
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
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              User Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Prescriptions
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user._count.patients}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user._count.prescriptions}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.id !== session.user.id ? (
                        <Link
                          href={`/api/admin/users/${user.id}?toggle=role`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {user.role === "admin"
                            ? "Demote to Clinician"
                            : "Promote to Admin"}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Current user
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
