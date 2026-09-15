"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Login fehlgeschlagen.");
        setPending(false);
        return;
      }

      const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="token" className="block text-sm font-medium text-text">
        Zugangstoken
      </label>
      <input
        id="token"
        name="token"
        type="password"
        autoComplete="off"
        autoFocus
        required
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="••••••••••••••••"
        className="w-full rounded-lg border border-line bg-surface-1 px-3 py-2.5 font-mono text-sm text-text outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25"
      />

      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || token.length === 0}
        className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-surface-0 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Prüfe …" : "Zugang entsperren"}
      </button>
    </form>
  );
}
