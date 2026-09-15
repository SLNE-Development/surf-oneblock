import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifySessionValue, type SessionInfo } from "@/lib/auth";

/**
 * Serverseitiger Session-Check für geschützte Layouts/Seiten.
 *
 * Die Middleware fängt unauthentifizierte Requests bereits ab; das hier ist
 * die zweite Schicht, damit auch bei einer umgangenen Middleware nie Inhalt
 * gerendert wird.
 */
export async function requireSession(): Promise<SessionInfo> {
  const store = await cookies();
  const session = await verifySessionValue(store.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/login");
  return session;
}
