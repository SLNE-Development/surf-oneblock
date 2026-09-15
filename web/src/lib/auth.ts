/**
 * Token-Gate.
 *
 * Ablauf:
 *   1. Nutzer gibt auf /login einen Zugangstoken ein.
 *   2. /api/login prüft ihn gegen ACCESS_TOKENS aus der Umgebung und setzt
 *      ein httpOnly-Cookie, das NICHT den Token enthält, sondern eine
 *      HMAC-Signatur über (Label, Ablaufzeit, Token).
 *   3. Die Middleware validiert dieses Cookie bei JEDEM Request, bevor
 *      irgendeine Seite gerendert wird. Zusätzlich prüft das Layout der
 *      geschützten Routen die Session noch einmal serverseitig
 *      (Defense in Depth — falls die Middleware je umgangen wird).
 *
 * Wird ein Token aus ACCESS_TOKENS entfernt, werden alle damit erzeugten
 * Sessions sofort ungültig, weil die Signatur nicht mehr nachrechenbar ist.
 *
 * Alles hier ist Edge-Runtime-kompatibel (Web Crypto, kein Node-Buffer).
 */

export const SESSION_COOKIE = "surf_oneblock_session";

/** Gültigkeitsdauer einer Session in Sekunden (Default: 30 Tage). */
export const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 30);

const encoder = new TextEncoder();

export interface AccessToken {
  /** Frei wählbares Label, taucht im Cookie und in Logs auf — nie der Token selbst. */
  label: string;
  value: string;
}

/**
 * Liest die gültigen Tokens aus der Umgebung.
 *
 * ACCESS_TOKENS akzeptiert eine kommagetrennte Liste, optional mit Label:
 *   ACCESS_TOKENS="team:sehr-langer-token,builder:anderer-token"
 *   ACCESS_TOKENS="sehr-langer-token"
 *
 * ACCESS_TOKEN (Singular) wird als Alias unterstützt.
 */
export function getAccessTokens(): AccessToken[] {
  const raw = process.env.ACCESS_TOKENS ?? process.env.ACCESS_TOKEN ?? "";
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const separator = entry.indexOf(":");
      if (separator > 0) {
        return {
          label: entry.slice(0, separator).trim(),
          value: entry.slice(separator + 1).trim(),
        };
      }
      return { label: index === 0 ? "default" : `token-${index + 1}`, value: entry };
    })
    .filter((token) => token.value.length > 0);
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length > 0) return secret;
  // Fallback: aus den Tokens ableiten. Funktioniert, bedeutet aber, dass sich
  // beim Ändern der Tokenliste alle Sessions invalidieren. Für den Produktiv-
  // betrieb SESSION_SECRET setzen.
  return getAccessTokens()
    .map((token) => token.value)
    .join("|");
}

function toBase64Url(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) binary += String.fromCharCode(view[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(signature);
}

/** Vergleich ohne frühen Abbruch, um Timing-Seitenkanäle zu vermeiden. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Prüft einen eingegebenen Token gegen die Umgebung. */
export function matchToken(input: string): AccessToken | null {
  const candidate = input.trim();
  if (!candidate) return null;
  for (const token of getAccessTokens()) {
    if (safeEqual(candidate, token.value)) return token;
  }
  return null;
}

/** Erzeugt den Cookie-Wert für eine gültige Session. */
export async function createSessionValue(token: AccessToken): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${token.label}:${expiresAt}:${token.value}`;
  const signature = await sign(payload, getSessionSecret());
  return `${encodeURIComponent(token.label)}.${expiresAt}.${signature}`;
}

export interface SessionInfo {
  label: string;
  expiresAt: number;
}

/** Validiert einen Cookie-Wert. Gibt null zurück, wenn irgendetwas nicht stimmt. */
export async function verifySessionValue(value: string | undefined): Promise<SessionInfo | null> {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [encodedLabel, expiresRaw, signature] = parts;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return null;

  let label: string;
  try {
    label = decodeURIComponent(encodedLabel);
  } catch {
    return null;
  }

  const token = getAccessTokens().find((entry) => entry.label === label);
  if (!token) return null;

  const expected = await sign(`${token.label}:${expiresAt}:${token.value}`, getSessionSecret());
  if (!safeEqual(signature, expected)) return null;

  return { label, expiresAt };
}

/** true, wenn überhaupt kein Token konfiguriert ist — dann ist die App gesperrt. */
export function isUnconfigured(): boolean {
  return getAccessTokens().length === 0;
}
