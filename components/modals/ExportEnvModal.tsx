"use client";

export default function ExportEnvModal({
  open,
  envText,
  onClose,
}: {
  open: boolean;
  envText: string;
  onClose: () => void;
}) {
  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(envText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-2 text-lg font-semibold">Export .env</h2>
        <p className="mb-4 text-sm text-neutral-400">
          Copy these values into a <code>.env</code> file. Never commit this
          file to version control.
        </p>

        <textarea
          readOnly
          value={envText}
          className="mb-4 h-64 w-full resize-none rounded bg-neutral-800 p-3 font-mono text-sm outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
