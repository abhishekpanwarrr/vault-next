"use client";
import { useState } from "react";
export default function AddProjectModal({
  open,
  onClose,
  onSave,
  name,
  setName,
}: {
  open: boolean;
  name: string;
  onClose: () => void;
  setName: (value: string) => void;
  onSave: () => void;
}) {
  const [error, setError] = useState<null | string>(null);
  if (!open) return null;

  const handleSave = () => {
    setError(null);

    if (!name) {
      setError("Name is required");
      return;
    }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Add secret</h2>

        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          className="mb-3 w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-neutral-600 focus:ring"
        />

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
