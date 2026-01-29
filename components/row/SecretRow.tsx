"use client";
import { useEffect, useRef, useState } from "react";

export type Secret = {
  id: string;
  key: string;
};

export default function SecretRow({ secret }: { secret: Secret }) {
  const [value, setValue] = useState<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleReveal = async () => {
    // Toggle hide
    if (value) {
      clearHideTimer();
      setValue(null);
      return;
    }
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/secrets/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretId: secret.id, // ✅ ONLY send secretId
        }),
      });

      if (!res.ok) {
        console.error("Reveal failed");
        return;
      }

      const data = await res.json();
      console.log("data", data);

      setValue(data.value);

      clearHideTimer();
      hideTimerRef.current = window.setTimeout(() => {
        setValue(null);
        hideTimerRef.current = null;
      }, 12_000);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    return alert("Data copied");
  };

  useEffect(() => {
    return () => clearHideTimer();
  }, []);

  return (
    <tr className="border-b border-neutral-800 h-12">
      <td className="px-3 py-2 font-mono text-sm">{secret.key}</td>

      <td className="px-3 py-2 font-mono text-sm">
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-neutral-400">
            <Spinner />
            Loading…
          </span>
        ) : value ? (
          value
        ) : (
          "••••••••••"
        )}
      </td>

      <td className="px-3 py-2 text-right text-sm">
        <button
          onClick={handleReveal}
          className="mr-3 text-neutral-300 hover:text-white"
        >
          {isLoading ? <Spinner /> : value ? "Hide" : "Reveal"}
        </button>

        <button
          onClick={handleCopy}
          disabled={!value}
          className={`text-neutral-300 hover:text-white ${
            !value ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          Copy
        </button>
      </td>
    </tr>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-neutral-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
