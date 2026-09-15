import { LoginForm } from "@/components/login-form";
import { isUnconfigured } from "@/lib/auth";

export const metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const unconfigured = isUnconfigured();

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
            OB
          </div>
          <div>
            <p className="text-sm font-semibold text-text">surf-oneblock</p>
            <p className="text-xs text-faint">Konzept &amp; Spezifikation</p>
          </div>
        </div>

        {unconfigured ? (
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            <p className="font-semibold">Kein Zugangstoken konfiguriert.</p>
            <p className="mt-1 text-warning/80">
              Setze <code className="font-mono">ACCESS_TOKENS</code> in der Umgebung und starte die
              Anwendung neu. Bis dahin ist kein Login möglich.
            </p>
          </div>
        ) : (
          <LoginForm next={params.next} />
        )}

        <p className="mt-6 text-xs leading-relaxed text-faint">
          Dieses Dokument ist nicht öffentlich. Den Token bekommst du vom Projektlead — gib ihn
          nicht weiter.
        </p>
      </div>
    </main>
  );
}
