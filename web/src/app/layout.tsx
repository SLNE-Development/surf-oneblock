import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "surf-oneblock — Konzept & Spezifikation",
    template: "%s · surf-oneblock",
  },
  description: "Internes Design-Dokument für den OneBlock-Spielmodus.",
  icons: { icon: "/surf-oneblock-logo.png" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
