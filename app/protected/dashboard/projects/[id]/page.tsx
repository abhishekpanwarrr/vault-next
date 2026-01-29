"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddSecretModal from "@/components/modals/AddSecretModal";
import ExportEnvModal from "@/components/modals/ExportEnvModal";
import SecretRow, { Secret } from "@/components/row/SecretRow";
import { createClient } from "@/lib/supabase/client";

export default function ProjectSecretsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const supabase = createClient();
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [envText, setEnvText] = useState("");
  // 🔄 Fetch secrets (KEYS ONLY)
  const fetchSecrets = async () => {
    const { data, error } = await supabase
      .from("secrets")
      .select("id, key_name")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch secrets failed", error);
      return;
    }

    setSecrets(
      data.map((s) => ({
        id: s.id,
        key: s.key_name,
        value: "", // NEVER fetched client-side
      }))
    );
  };

  useEffect(() => {
    if (projectId) {
      fetchSecrets();
    }
  }, [projectId]);

  const handleAddSecret = async (key: string, value: string) => {
    // ✅ Browser-safe UTF-8 to Base64 conversion
    const cipherTextBase64 = btoa(
      encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );

    // ✅ Browser-safe binary to Base64 (for IV and Auth Tag)
    const ivArray = crypto.getRandomValues(new Uint8Array(12));
    const ivBase64 = btoa(String.fromCharCode(...ivArray));

    const authTagArray = crypto.getRandomValues(new Uint8Array(16));
    const authTagBase64 = btoa(String.fromCharCode(...authTagArray));

    const { error } = await supabase.from("secrets").insert({
      project_id: projectId,
      key_name: key,
      cipher_text: cipherTextBase64,
      iv: ivBase64,
      auth_tag: authTagBase64,
    });

    if (error) console.error("Create secret failed", error);
    else {
      setShowAdd(false);
      fetchSecrets();
    }
  };

  const handleExport = async () => {
    const res = await fetch("/api/secrets/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (!res.ok) {
      console.error("Export failed");
      return;
    }

    const data = await res.json();
    setEnvText(data.env);
    setShowExport(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Project Secrets</h1>

        <div className="space-x-3">
          <button
            onClick={handleExport}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm"
          >
            Export .env
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900"
          >
            + Add Secret
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-neutral-800">
        <table className="w-full border-collapse text-left">
          <thead className="bg-neutral-900 text-sm text-neutral-400">
            <tr>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {secrets.map((secret) => (
              <SecretRow key={secret.id} secret={secret} />
            ))}
          </tbody>
        </table>
      </div>

      <AddSecretModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAddSecret}
      />

      <ExportEnvModal
        open={showExport}
        envText={envText}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
