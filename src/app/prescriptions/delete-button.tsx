"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePrescriptionButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    await fetch(`/api/prescriptions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-600" title="Delete">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
