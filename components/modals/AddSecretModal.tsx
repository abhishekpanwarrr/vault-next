"use client";

import { useState } from "react";

export default function AddSecretModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (key: string, value: string) => void;
}) {
  const [keyName, setKeyName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = () => {
    setError(null);

    if (!keyName || !value) {
      setError("Both key and value are required");
      return;
    }

    if (!/^[A-Z0-9_]+$/.test(keyName)) {
      setError("Key must be UPPERCASE and contain only A–Z, 0–9, _");
      return;
    }

    onSave(keyName, value);
    setKeyName("");
    setValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Add secret</h2>

        <input
          placeholder="KEY_NAME"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value.toUpperCase())}
          className="mb-3 w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-neutral-600 focus:ring"
        />

        <input
          type="password"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
